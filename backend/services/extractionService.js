const OpenAI = require("openai");

const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_TRANSIENT_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 150;

class ExtractionServiceError extends Error {
  constructor(kind) {
    super(
      kind === "configuration"
        ? "AI extraction is not configured"
        : "Extraction service unavailable, please try again"
    );
    this.name = "ExtractionServiceError";
    this.kind = kind;
  }
}

function schemaFields(fields) {
  if (!Array.isArray(fields)) return [];

  return fields
    .filter((field) => field && typeof field.name === "string" && field.name.trim())
    .map((field) => ({
      name: field.name.trim(),
      label: field.label || field.name.trim(),
      type: field.type || "text",
      options: Array.isArray(field.options)
        ? field.options.map((option) => option.value ?? option.label).filter(Boolean)
        : [],
      showIf: field.showIf?.fieldId
        ? { fieldId: field.showIf.fieldId, equals: field.showIf.equals }
        : undefined,
    }));
}

function emptyExtraction(fields) {
  return Object.fromEntries(
    schemaFields(fields).map((field) => [
      field.name,
      { value: field.type === "checkbox" ? false : "", found: false },
    ])
  );
}

function cleanExtraction(value, fields) {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
  const result = emptyExtraction(fields);

  // Parse only known schema fields and normalize their types. This is the
  // safety boundary between model output and the client-facing form payload.
  for (const field of schemaFields(fields)) {
    const candidate = source[field.name];
    const valueForField = candidate?.value;
    const found = candidate?.found === true;
    if (typeof valueForField === "string") {
      result[field.name] = { value: valueForField.trim(), found };
    } else if (field.type === "checkbox" && typeof valueForField === "boolean") {
      result[field.name] = { value: valueForField, found };
    }
  }

  return result;
}

async function requestModelExtraction(client, story, fields, strict) {
  const formFields = schemaFields(fields);
  const fieldInstructions = JSON.stringify(formFields);
  // Give the model the live form schema so its JSON can be applied directly.
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_EXTRACTION_MODEL || "gpt-4o-mini",
    response_format: { type: "json_object" },
    timeout: Number(process.env.OPENAI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
    messages: [
      {
        role: "system",
        content: strict
          ? `Return valid JSON only. No markdown, code fences, prose, or extra keys. Use exactly the field names in this schema: ${fieldInstructions}. Each field must be {"value": string|boolean, "found": boolean}; set found false only when the story does not provide a value.`
          : `Extract the story into the supplied form schema. Return a JSON object with exactly the schema field names. Every field value must be {"value": string|boolean, "found": boolean}. Set found false when the story does not clearly provide a value, including conditional child fields whose value is ambiguous; use value "" for missing text/select fields and false for missing checkboxes. Include conditional fields too; use each field's showIf rule to understand its relationship to the controlling field. Never guess. For select fields, use an exact option value when options are supplied. Schema: ${fieldInstructions}. Return JSON only, with no markdown or prose.`,
      },
      {
        role: "user",
        content: story,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("The extraction provider returned an empty response");
  }

  return JSON.parse(content);
}

function isProviderFailure(error) {
  return !(error instanceof SyntaxError) && Boolean(
    error?.status === 429 || error?.status >= 500 || error?.code ||
    error?.name === "APIConnectionTimeoutError" ||
    error?.name === "RateLimitError"
  );
}

function providerErrorKind(error) {
  if (error?.status === 429 || error?.name === "RateLimitError") return "rate_limit";
  if (error?.name === "APIConnectionTimeoutError" || error?.code === "ETIMEDOUT") return "timeout";
  return "unavailable";
}

function isTransientProviderFailure(error) {
  // Do not retry client-side/provider rate-limit errors: retrying them adds
  // load when the service has explicitly asked us to slow down.
  return error?.status === 408 || error?.status >= 500 ||
    error?.code === "ETIMEDOUT" || error?.code === "ECONNRESET" ||
    error?.code === "ECONNREFUSED" || error?.code === "ENOTFOUND" ||
    error?.name === "APIConnectionTimeoutError";
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function requestWithTransientRetry(client, story, fields) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await requestModelExtraction(client, story, fields, false);
    } catch (error) {
      if (!isTransientProviderFailure(error) || attempt >= MAX_TRANSIENT_RETRIES) {
        throw error;
      }

      // Retry only transient transport/provider failures with a small
      // exponential backoff; malformed output uses the strict fallback below.
      const delay = RETRY_BASE_DELAY_MS * (2 ** attempt);
      await sleep(delay);
    }
  }
}

/**
 * Extract a form-schema-shaped response from a free-form story.
 */
async function extractFromStory(text, fields) {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("A non-empty story is required for extraction");
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new ExtractionServiceError("configuration");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: Number(process.env.OPENAI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
  });
  try {
    return cleanExtraction(await requestWithTransientRetry(client, text, fields), fields);
  } catch (error) {
    // Provider failures are surfaced to the route; malformed output gets one stricter retry.
    if (isProviderFailure(error)) {
      throw new ExtractionServiceError(providerErrorKind(error));
    }

    try {
      return cleanExtraction(await requestModelExtraction(client, text, fields, true), fields);
    } catch (retryError) {
      if (isProviderFailure(retryError)) {
        throw new ExtractionServiceError(providerErrorKind(retryError));
      }
      // Invalid model output must not break form completion; return schema-safe defaults.
      return emptyExtraction(fields);
    }
  }
}

function extractLocallyFromStory(text, fields) {
  const result = emptyExtraction(fields);
  const story = text.trim();
  const lowerStory = story.toLowerCase();

  for (const field of schemaFields(fields)) {
    let value = "";

    if (/email/i.test(`${field.name} ${field.label}`)) {
      value = story.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] || "";
    } else if (/name/i.test(`${field.name} ${field.label}`)) {
      value = story.match(/(?:my name is|i am|i'm|name is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)*?)(?:\s+and|\s+from|\.|,|$)/i)?.[1]?.trim() || "";
    }

    if (!value && field.options.length > 0) {
      const matchingOption = field.options.find((option) =>
        lowerStory.includes(String(option).toLowerCase())
      );
      value = matchingOption || "";
    }

    if (value) {
      result[field.name] = { value, found: true };
    }
  }

  return result;
}

module.exports = {
  extractFromStory,
  extractLocallyFromStory,
  ExtractionServiceError,
};
