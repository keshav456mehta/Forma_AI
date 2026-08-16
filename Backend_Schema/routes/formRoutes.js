const express = require("express");
const Form = require("../models/form");

const router = express.Router();

// GET /api/forms/:id
// Retrieve a form by ID


router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    // Form not found
    if (!form) {
      return res.status(404).json({
        message: "Form not found",
      });
    }

    return res.status(200).json(form);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid form ID",
      error: error.message,
    });
  }
});


// POST /api/forms
// Create a new form


router.post("/", async (req, res) => {
  try {
    const { title, description, fields } = req.body;

    // Basic validation
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const form = new Form({
      title,
      description,
      fields,
    });

    const savedForm = await form.save();

    return res.status(201).json(savedForm);
  } catch (error) {
    return res.status(400).json({
      message: "Failed to create form",
      error: error.message,
    });
  }
});

module.exports = router;