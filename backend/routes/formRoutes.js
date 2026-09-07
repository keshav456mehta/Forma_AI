const express = require("express");
const mongoose = require("mongoose");
const {
  getAllForms,
  getFormById,
  submitForm,
  fallbackForm,
  shouldUseFallbackForm,
} = require("../controllers/formController");
const { saveDraft, getDraft } = require("../controllers/draftController");
const Form = require("../models/Form");
const {
  extractFromStory,
  extractLocallyFromStory,
  ExtractionServiceError,
} = require("../services/extractionService");

const router = express.Router();

// Keep the public form API grouped under /api/forms in server.js.
router.get("/", getAllForms);
router.get("/:id", getFormById);
router.post("/:id/submit", submitForm);

// Save a partial form and resume it later with the returned opaque token.
router.post("/:id/draft", saveDraft);
router.get("/:id/draft/:resumeToken", getDraft);

/**
 * Turn a free-form story into a form submission using the form's own schema.
 * The route deliberately contains no prompt or parsing logic; that boundary
 * belongs in extractionService so every extraction client gets the same
 * JSON-only response contract.
 */
router.post("/:id/extract", async (req, res) => {
  const { id } = req.params;
  const story = req.body?.story;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid form ID" });
  }

  if (typeof story !== "string" || !story.trim()) {
    return res.status(400).json({ error: "story is required" });
  }

  try {
    const useLocalFallback = process.env.NODE_ENV !== "test" && shouldUseFallbackForm();
    const storedForm = useLocalFallback ? null : await Form.findById(id).lean();
    const form = storedForm || (id === fallbackForm._id ? fallbackForm : null);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const extracted = !process.env.OPENAI_API_KEY
      ? extractLocallyFromStory(story, form.fields)
      : await extractFromStory(story, form.fields);
    return res.status(200).json(extracted);
  } catch (error) {
    // Do not expose provider details, raw prompts, or model output to clients.
    if (error instanceof ExtractionServiceError) {
      return res.status(error.kind === "rate_limit" ? 429 : 503).json({
        error: error.kind === "configuration"
          ? "AI extraction is not configured. Add OPENAI_API_KEY to backend/.env and restart the backend."
          : "Extraction service unavailable, please try again",
      });
    }

    return res.status(500).json({
      error: "Extraction service unavailable, please try again",
    });
  }
});

module.exports = router;
