const mongoose = require("mongoose");
const Form = require("../models/Form");
const validateRequiredFields = require("../validateSubmission");

const fallbackForm = {
  _id: "6a828552980c388e1d07ee4c",
  title: "Basic Information",
  description: "Collect basic user information for onboarding.",
  fields: [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      required: true,
      order: 1,
    },
    {
      name: "email",
      label: "Email Address",
      type: "text",
      required: true,
      order: 2,
    },
    {
      name: "department",
      label: "Department",
      type: "dropdown",
      required: false,
      order: 3,
      options: [
        { label: "Engineering", value: "Engineering" },
        { label: "Marketing", value: "Marketing" },
        { label: "Operations", value: "Operations" },
      ],
    },
  ],
};

function shouldUseFallbackForm() {
  return !process.env.MONGODB_URI && !process.env.MONGO_URI;
}

// Validate the identifier before querying so malformed input has a stable API error.
async function getFormById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Invalid form ID",
    });
  }

  try {
    if (shouldUseFallbackForm()) {
      return res.status(200).json(fallbackForm);
    }

    const form = await Form.findById(id).lean();

    if (!form) {
      return res.status(404).json({
        error: "Form not found",
      });
    }

    return res.status(200).json(form);
  } catch (error) {
    if (shouldUseFallbackForm()) {
      return res.status(200).json(fallbackForm);
    }

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
    const form = shouldUseFallbackForm()
      ? fallbackForm
      : await Form.findById(id).lean();

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
  fallbackForm,
  shouldUseFallbackForm,
};
