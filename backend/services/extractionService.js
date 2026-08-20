const OpenAI = require("openai");

const DEFAULT_TIMEOUT_MS = 15_000;

class ExtractionServiceError extends Error {
  constructor(kind) {
    super("Extraction service unavailable, please try again");
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
      field.type === "checkbox" ? false : "",
    ])
  );
}

function cleanExtraction(value, fields) {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
  const result = emptyExtraction(fields);

  for (const field of schemaFields(fields)) {
    const valueForField = source[field.name];
    if (typeof valueForField === "string") {
      result[field.name] = valueForField.trim();
    } else if (field.type === "checkbox" && typeof valueForField === "boolean") {
      result[field.name] = valueForField;
    }
  }

  return result;
}

async function requestModelExtraction(client, story, fields, strict) {
  const formFields = schemaFields(fields);
  const fieldInstructions = JSON.stringify(formFields);
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_EXTRACTION_MODEL || "gpt-4o-mini",
    response_format: { type: "json_object" },
    timeout: Number(process.env.OPENAI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
    messages: [
      {
        role: "system",
        content: strict
          ? `Return valid JSON only. No markdown, code fences, prose, or extra keys. Use exactly the field names in this schema: ${fieldInstructions}. Return an empty string (or false for checkboxes) when uncertain.`
          : `Extract the story into the supplied form schema. Return a flat JSON object with exactly the schema field names. Include conditional fields too; use each field's showIf rule to understand its relationship to the controlling field. Never guess. Return an empty string for unknown text/select fields and false for unknown checkboxes. For select fields, use an exact option value when options are supplied. Schema: ${fieldInstructions}. Return JSON only, with no markdown or prose.`,
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
  return !(error instanceof SyntaxError) &&
    (error?.status === 429 || error?.status >= 500 || error?.code || error?.name);
}

function providerErrorKind(error) {
  if (error?.status === 429 || error?.name === "RateLimitError") return "rate_limit";
  if (error?.name === "APIConnectionTimeoutError" || error?.code === "ETIMEDOUT") return "timeout";
  return "unavailable";
}

/**
 * Extract a form-schema-shaped response from a free-form story.
 */
async function extractFromStory(text, fields) {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("A non-empty story is required for extraction");
  }

  if (!process.env.OPENAI_API_KEY) {
    return emptyExtraction(fields);
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: Number(process.env.OPENAI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
  });
  try {
    return cleanExtraction(await requestModelExtraction(client, text, fields, false), fields);
  } catch (error) {
    console.error("AI extraction attempt failed:", error.message);

    if (isProviderFailure(error)) {
      throw new ExtractionServiceError(providerErrorKind(error));
    }

    try {
      return cleanExtraction(await requestModelExtraction(client, text, fields, true), fields);
    } catch (retryError) {
      console.error("AI extraction retry failed; using empty fallback:", retryError.message);

      if (isProviderFailure(retryError)) {
        throw new ExtractionServiceError(providerErrorKind(retryError));
      }
      return emptyExtraction(fields);
    }
  }
}

module.exports = { extractFromStory, ExtractionServiceError };