const mongoose = require("mongoose");
const Form = require("../models/Form");
const validateRequiredFields = require("../validateSubmission");
const { extractFields } = require("../services/extractionService");

// Get form by ID
async function getFormById(req, res) {
  const { id } = req.params;

  // Check whether ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid form ID" });
  }

  try {
    const form = await Form.findById(id).lean();

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    return res.status(200).json(form);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch form",
      details: error.message,
    });
  }
}

// Submit form data
async function submitForm(req, res) {
  const { id } = req.params;

  // Check whether ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid form ID" });
  }

  try {
    const form = await Form.findById(id).lean();

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Validate required fields
    const missingFields = validateRequiredFields(form.fields, req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        fields: missingFields,
      });
    }

    return res.status(200).json({
      message: "Submission is valid",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to validate submission",
      details: error.message,
    });
  }
}

// Extract form fields from a user story
async function extractFormFields(req, res) {
  const { id } = req.params;
  const { story } = req.body;

  // Validate form ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Invalid form ID",
    });
  }

  // Validate story
  if (!story || typeof story !== "string") {
    return res.status(400).json({
      error: "Story is required",
    });
  }

  try {
    // Extract fields from the user story
    const result = extractFields(story);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to extract form fields",
      details: error.message,
    });
  }
}

module.exports = {
  getFormById,
  submitForm,
  extractFormFields,
};