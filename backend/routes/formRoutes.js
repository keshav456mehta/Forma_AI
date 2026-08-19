const express = require("express");

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

// Extract form fields from a user story
router.post("/:id/extract", extractFormFields);

module.exports = router;