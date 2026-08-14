const mongoose = require("mongoose");
const Form = require("../models/Form");
const validateRequiredFields = require("../validateSubmission");

async function getFormById(req, res) {
  const { id } = req.params;

  // Reject malformed IDs before querying MongoDB so clients get a clear 400.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid form ID" });
  }

  try {
    const form = await Form.findById(id).lean();

    // A valid ID may still not map to a stored form.
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

async function submitForm(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid form ID" });
  }

  try {
    const form = await Form.findById(id).lean();

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Required fields are evaluated against showIf rules, so hidden fields do
    // not block a submission while visible required fields do.
    const missingFields = validateRequiredFields(form.fields, req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        fields: missingFields,
      });
    }

    return res.status(200).json({ message: "Submission is valid" });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to validate submission",
      details: error.message,
    });
  }
}

module.exports = {
  getFormById,
  submitForm,
};
