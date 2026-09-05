const mongoose = require("mongoose");
const Form = require("../models/Form");
const validateRequiredFields = require("../validateSubmission");


// Validate the identifier before querying so malformed input has a stable API error.
async function getFormById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Invalid form ID",
    });
  }

  try {
    const form = await Form.findById(id).lean();

    if (!form) {
      return res.status(404).json({
        error: "Form not found",
      });
    }

    return res.status(200).json(form);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch form",
    });
  }
}


// Validate against the stored schema rather than trusting client-side required checks.
async function submitForm(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Invalid form ID",
    });
  }

  try {
    const form = await Form.findById(id).lean();

    if (!form) {
      return res.status(404).json({
        error: "Form not found",
      });
    }

    const missingFields = validateRequiredFields(
      form.fields,
      req.body
    );

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
    });
  }
}


module.exports = {
  getFormById,
  submitForm,
};
