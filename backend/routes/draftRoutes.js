const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");

const Draft = require("../models/Draft");
const Form = require("../models/Form");

const router = express.Router();
const DRAFT_EXPIRY_DAYS = 30;

function generateResumeToken() {
  return crypto.randomBytes(24).toString("hex");
}

function getDraftExpiryDate() {
  return new Date(Date.now() + DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
}

router.post("/", async (req, res) => {
  try {
    const { formId, partialValues = {} } = req.body;

    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ error: "Invalid form ID" });
    }

    const form = await Form.findById(formId).lean();
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // A draft follows the current schema, so stale client keys are never
    // persisted and cannot reappear when the form is resumed.
    const validFieldNames = new Set(form.fields.map((field) => field.name));
    const compatibleValues = {};
    Object.entries(partialValues).forEach(([fieldName, value]) => {
      if (validFieldNames.has(fieldName)) compatibleValues[fieldName] = value;
    });

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
  } catch (_error) {
    return res.status(500).json({ error: "Unable to save draft" });
  }
});

router.get("/:resumeToken", async (req, res) => {
  try {
    const { resumeToken } = req.params;
    const draft = await Draft.findOne({ resumeToken }).lean();

    if (!draft) return res.status(404).json({ error: "Draft not found" });

    // Expiry is checked before returning saved values, including drafts kept
    // after expiration so clients receive a useful 410 response.
    if (draft.expiresAt && draft.expiresAt <= new Date()) {
      return res.status(410).json({ error: "Draft expired" });
    }

    const form = await Form.findById(draft.formId).lean();
    if (!form) return res.status(404).json({ error: "Form not found" });

    const validFieldNames = new Set(form.fields.map((field) => field.name));
    const compatibleValues = {};
    Object.entries(draft.partialValues || {}).forEach(([fieldName, value]) => {
      if (validFieldNames.has(fieldName)) compatibleValues[fieldName] = value;
    });

    return res.status(200).json({
      id: draft._id,
      formId: draft.formId,
      partialValues: compatibleValues,
      savedAt: draft.savedAt,
      resumeToken: draft.resumeToken,
      expiresAt: draft.expiresAt,
    });
  } catch (_error) {
    return res.status(500).json({ error: "Unable to resume draft" });
  }
});

module.exports = router;
