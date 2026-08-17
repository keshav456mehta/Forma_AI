const OpenAI = require("openai");

function allowedFieldNames(fields) {
  return fields
    .map((field) => field?.name)
    .filter((name) => typeof name === "string" && name.length > 0);
}

function cleanExtraction(value, fields) {
  const result = {};
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};

  // The model must never be able to invent an API field name. Returning null
  // for a field it cannot infer gives the frontend a predictable shape.
  for (const name of allowedFieldNames(fields)) {
    result[name] = Object.prototype.hasOwnProperty.call(source, name)
      ? source[name]
      : null;
  }

  return result;
}

function fallbackExtraction(text, fields) {
  const lower = text.toLowerCase();
  const values = {};

  for (const field of fields) {
    const name = field.name;
    const hint = `${name} ${field.label || ""}`.toLowerCase();

    if (hint.includes("incident") || hint.includes("accident")) {
      values[name] = /deer|collision|crash|hit\b|rear-ended/.test(lower)
        ? "collision"
        : null;
    } else if (hint.includes("vehicle") || hint.includes("car")) {
      const vehicle = text.match(/(?:my|a|an)\s+([A-Z][\w-]*(?:\s+[A-Z][\w-]*)?)/);
      values[name] = vehicle ? vehicle[1] : null;
    } else if (hint.includes("damage")) {
      const damage = text.match(/(?:and|,|with)\s+the\s+([^.,]+?)(?:\s+(?:was|is|got))?\s*(shattered|damaged|broken|cracked)/i);
      values[name] = damage ? `${damage[1].trim()} ${damage[2]}` : null;
    }
  }

  return cleanExtraction(values, fields);
}

/**
 * Extract values for an existing form schema. When OPENAI_API_KEY is present
 * the LLM is required to return a JSON object; the final allow-list pass keeps
 * the public response limited to the names defined by the schema. The local
 * fallback keeps development and tests usable without an API key.
 */
async function extractFromStory(text, fields) {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("A non-empty story is required for extraction");
  }

  if (!Array.isArray(fields)) {
    throw new Error("A form field schema is required for extraction");
  }

  if (!process.env.OPENAI_API_KEY) {
    return fallbackExtraction(text, fields);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const schema = fields.map(({ name, label, type, options }) => ({
    name,
    label,
    type,
    options: options?.map((option) => option.value),
  }));
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_EXTRACTION_MODEL || "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Extract values from the story. Return one JSON object only, with exactly the schema field names. Use null when a value cannot be inferred.",
      },
      {
        role: "user",
        content: JSON.stringify({ story: text, fields: schema }),
      },
    ],
  });

  const content = completion.choices[0]?.message?.content || "{}";
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("The extraction provider returned invalid JSON");
  }

  return cleanExtraction(parsed, fields);
}

module.exports = { extractFromStory };
