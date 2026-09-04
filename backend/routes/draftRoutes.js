const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Draft = require("../models/Draft");
const Form = require("../models/Form");

const router = express.Router();

// Draft expiry: 30 days
const DRAFT_EXPIRY_DAYS = 30;

// Generate a unique resume token
function generateResumeToken() {
  return crypto.randomBytes(24).toString("hex");
}

// Calculate draft expiry date
function getDraftExpiryDate() {
  return new Date(
    Date.now() + DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );
}

// ======================================================
// POST /api/drafts
// Save a partially completed form
// ======================================================

router.post("/", async (req, res) => {
  try {
    const { formId, partialValues = {} } = req.body;

    // Validate form ID
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({
        error: "Invalid form ID",
      });
    }

    // Make sure the form exists
    const form = await Form.findById(formId).lean();

    if (!form) {
      return res.status(404).json({
        error: "Form not found",
      });
    }

    // Only save fields that currently exist in the form schema.
    const validFieldNames = new Set(
      form.fields.map((field) => field.name)
    );

    const compatibleValues = {};

    Object.entries(partialValues).forEach(
      ([fieldName, value]) => {
        if (validFieldNames.has(fieldName)) {
          compatibleValues[fieldName] = value;
        }
      }
    );

    // Create draft
    const draft = await Draft.create({
      formId,
      partialValues: compatibleValues,
      savedAt: new Date(),
      resumeToken: generateResumeToken(),
      expiresAt: getDraftExpiryDate(),
    });

    return res.status(201).json({
      id: draft._id,
      formId: draft.formId,
      partialValues: draft.partialValues,
      savedAt: draft.savedAt,
      resumeToken: draft.resumeToken,
      expiresAt: draft.expiresAt,
    });
  } catch (error) {
    console.error("Save draft failed:", error.message);

    return res.status(500).json({
      error: "Unable to save draft",
    });
  }
});

// ======================================================
// GET /api/drafts/:resumeToken
// Resume a saved draft
// ======================================================

router.get("/:resumeToken", async (req, res) => {
  try {
    const { resumeToken } = req.params;

    // Find draft
    const draft = await Draft.findOne({
      resumeToken,
    }).lean();

    if (!draft) {
      return res.status(404).json({
        error: "Draft not found",
      });
    }

    // Check draft expiry
    if (draft.expiresAt && draft.expiresAt <= new Date()) {
      return res.status(410).json({
        error: "Draft expired",
      });
    }

    // Load current form schema
    const form = await Form.findById(draft.formId).lean();

    if (!form) {
      return res.status(404).json({
        error: "Form not found",
      });
    }

    // Current form schema is authoritative.
    // Ignore fields that no longer exist.
    const validFieldNames = new Set(
      form.fields.map((field) => field.name)
    );

    const compatibleValues = {};

    Object.entries(draft.partialValues || {}).forEach(
      ([fieldName, value]) => {
        if (validFieldNames.has(fieldName)) {
          compatibleValues[fieldName] = value;
        }
      }
    );

    return res.status(200).json({
      id: draft._id,
      formId: draft.formId,
      partialValues: compatibleValues,
      savedAt: draft.savedAt,
      resumeToken: draft.resumeToken,
      expiresAt: draft.expiresAt,
    });
  } catch (error) {
    console.error("Resume draft failed:", error.message);

    return res.status(500).json({
      error: "Unable to resume draft",
    });
  }
});

module.exports = router;