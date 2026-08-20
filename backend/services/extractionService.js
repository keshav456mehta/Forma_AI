const OpenAI = require("openai");

async function extractFromStory(story, fields = []) {
  if (!story || typeof story !== "string" || !story.trim()) {
    throw new Error("Story must be a non-empty string");
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

// --- Vinay's real OpenAI-based extraction (Day 9-12 branch) ---
// NOT WIRED IN YET: only handles incidentType/vehicle/damage, ignores the
// `fields` param entirely, so it breaks on Basic Info / Vehicle Registration
// forms. Needs generalizing to accept dynamic fields before it replaces the
// mock above. Flag to Vinay.
const RAKESH_FIELDS = ["incidentType", "vehicle", "damage"];

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

  return result;
}

async function requestModelExtraction(client, story, strict) {
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_EXTRACTION_MODEL || "gpt-4o-mini",
    response_format: { type: "json_object" },
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

async function extractFromStoryAI(text, _fields) {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("A non-empty story is required for extraction");
  }

  if (!process.env.OPENAI_API_KEY) {
    return emptyExtraction();
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    return cleanExtraction(await requestModelExtraction(client, text, false));
  } catch (error) {
    console.error("AI extraction attempt failed:", error.message);

    try {
      return cleanExtraction(await requestModelExtraction(client, text, true));
    } catch (retryError) {
      console.error("AI extraction retry failed; using empty fallback:", retryError.message);
      return emptyExtraction();
    }
  }
}

module.exports = {
  extractFromStory,
  extractFields,
  extractFromStoryAI,
};