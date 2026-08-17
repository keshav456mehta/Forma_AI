const OpenAI = require("openai");

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

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    return cleanExtraction(await requestModelExtraction(client, text, false));
  } catch (error) {
    // Prompts and provider output are never sent to clients.
    console.error("AI extraction attempt failed:", error.message);

    try {
      return cleanExtraction(await requestModelExtraction(client, text, true));
    } catch (retryError) {
      console.error("AI extraction retry failed; using empty fallback:", retryError.message);
      return emptyExtraction();
    }
  }
}

module.exports = { extractFromStory };
