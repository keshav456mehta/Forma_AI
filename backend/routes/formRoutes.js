const express = require("express");

const mongoose = require("mongoose");
const { getFormById, submitForm } = require("../controllers/formController");
const Form = require("../models/Form");
const {
  extractFromStory,
  ExtractionServiceError,
} = require("../services/extractionService");


const {
  getFormById,
  submitForm,
  extractFormFields,
} = require("../controllers/formController");


const router = express.Router();

// Get a form by ID
router.get("/:id", getFormById);

// Submit form data
router.post("/:id/submit", submitForm);


    const extracted = await extractFromStory(story, form.fields);
    return res.status(200).json(extracted);
  } catch (error) {
    // Do not expose provider details, raw prompts, or model output to clients.
    console.error("Form extraction failed:", error.message);

    if (error instanceof ExtractionServiceError) {
      return res.status(error.kind === "rate_limit" ? 429 : 503).json({
        error: "Extraction service unavailable, please try again",
      });
    }

    return res.status(500).json({
      error: "Extraction service unavailable, please try again",
    });
  }
});
// Extract form fields from a user story
router.post("/:id/extract", extractFormFields);


module.exports = router;