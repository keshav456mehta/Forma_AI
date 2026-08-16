/**
 * Placeholder for the future LLM-backed story extraction workflow.
 *
 * Keeping this boundary asynchronous lets callers use it now without needing
 * changes when the real provider integration is added.
 */
async function extractFromStory(text) {
  return {
    status: "not_implemented",
    sourceText: text,
    fields: [],
  };
}

module.exports = { extractFromStory };
