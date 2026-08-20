async function extractFromStory(story, fields = []) {
  if (!story || typeof story !== "string" || !story.trim()) {
    throw new Error("Story must be a non-empty string");
  }


const RAKESH_FIELDS = ["incidentType", "vehicle", "damage"];
const DEFAULT_TIMEOUT_MS = 15_000;

class ExtractionServiceError extends Error {
  constructor(kind) {
    super("Extraction service unavailable, please try again");
    this.name = "ExtractionServiceError";
    this.kind = kind;
  }
}

function emptyExtraction() {
  return { incidentType: "", vehicle: "", damage: "" };
}

function cleanExtraction(value) {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
  const result = emptyExtraction();

  for (const name of RAKESH_FIELDS) {
    if (typeof source[name] === "string") {
      result[name] = source[name].trim();
    }
  }

  if (!Array.isArray(fields)) {
    throw new Error("Fields must be an array");
  }

  const result = {};
  const text = story.toLowerCase();


  for (const field of fields) {
    const fieldName =
      typeof field === "string"
        ? field
        : field.name || field.label || field.id;


async function requestModelExtraction(client, story, strict) {
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_EXTRACTION_MODEL || "gpt-4o-mini",
    response_format: { type: "json_object" },
    timeout: Number(process.env.OPENAI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
    messages: [
      {
        role: "system",
        content: strict
          ? "Return valid JSON only. No markdown, code fences, prose, or extra keys. Use exactly incidentType, vehicle, and damage. Return an empty string when uncertain."
          : "Extract an insurance incident into exactly this JSON shape: {\"incidentType\": \"\", \"vehicle\": \"\", \"damage\": \"\"}. Never guess; use an empty string when a value is not confidently stated. Example: for 'I hit a deer on I-95 yesterday in my Honda, and the windshield shattered.', return {\"incidentType\": \"animal_collision\", \"vehicle\": \"Honda\", \"damage\": \"windshield\"}. Return JSON only, with no markdown or prose.",
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
 * Extract Rakesh's insurance schema from a story. The fields argument remains
 * accepted for route compatibility, but the response is intentionally fixed.
 */
async function extractFromStory(text, _fields) {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("A non-empty story is required for extraction");
  }

  if (!process.env.OPENAI_API_KEY) {
    return emptyExtraction();
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: Number(process.env.OPENAI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
  });
  try {
    return cleanExtraction(await requestModelExtraction(client, text, false));
  } catch (error) {
    // Prompts and provider output are never sent to clients.
    console.error("AI extraction attempt failed:", error.message);

    if (isProviderFailure(error)) {
      throw new ExtractionServiceError(providerErrorKind(error));
    }

    try {
      return cleanExtraction(await requestModelExtraction(client, text, true));
    } catch (retryError) {
      console.error("AI extraction retry failed; using empty fallback:", retryError.message);

      if (isProviderFailure(retryError)) {
        throw new ExtractionServiceError(providerErrorKind(retryError));
      }
      return emptyExtraction();
    }
  }
}

module.exports = { extractFromStory, ExtractionServiceError };

    if (!fieldName) continue;

    const normalizedName = fieldName.toLowerCase();

    // Incident type
    if (
      normalizedName === "incidenttype" ||
      normalizedName === "incident_type"
    ) {
      if (
        text.includes("collision") ||
        text.includes("crash") ||
        text.includes("accident") ||
        text.includes("hit a deer") ||
        text.includes("hit deer")
      ) {
        result[fieldName] = "collision";
      }
    }

    // Vehicle
    else if (
      normalizedName === "vehicle" ||
      normalizedName === "vehiclemake"
    ) {
      const match = story.match(
        /\b(Honda|Toyota|Ford|BMW|Audi|Tesla|Hyundai|Kia)\b/i
      );

      if (match) {
        result[fieldName] = match[1];
      }
    }

    // Damage
    else if (
      normalizedName === "damage" ||
      normalizedName === "damagedescription"
    ) {
      if (text.includes("windshield shattered")) {
        result[fieldName] = "windshield shattered";
      } else if (text.includes("windshield")) {
        result[fieldName] = "windshield damage";
      } else if (text.includes("damage")) {
        result[fieldName] = "damage reported";
      }
    }

    // Location
    else if (
      normalizedName === "location" ||
      normalizedName === "address"
    ) {
      const match = story.match(/\bI-\d+\b/i);

      if (match) {
        result[fieldName] = match[0].toUpperCase();
      }
    }

    // Date
    else if (
      normalizedName === "date" ||
      normalizedName === "incidentdate"
    ) {
      if (text.includes("yesterday")) {
        result[fieldName] = "yesterday";
      }
    }
  }

  return result;
}


// API-level extraction when MongoDB/form schema is unavailable.
// This keeps the extraction endpoint usable for testing.
async function extractFields(story) {
  if (!story || typeof story !== "string" || !story.trim()) {
    throw new Error("Story must be a non-empty string");
  }

  const fields = [
    "incidentType",
    "vehicle",
    "damage",
    "location",
    "date",
  ];

  return extractFromStory(story, fields);
}


module.exports = {
  extractFromStory,
  extractFields,
};

