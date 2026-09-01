const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const Form = require("../models/Form");
const Draft = require("../models/Draft");

const DRAFT_EXPIRY_DAYS = 30;

// Save a partially-filled form snapshot that can later be resumed using a
// non-sequential, public-safe token instead of exposing the database id.
async function saveDraft(req, res) {
  const { id } = req.params;
  const values = req.body?.values;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Invalid form ID",
    });
  }

  if (typeof values !== "object" || values === null) {
    return res.status(400).json({
      error: "values is required",
    });
  }

  try {
    const form = await Form.findById(id).lean();

    if (!form) {
      return res.status(404).json({
        error: "Form not found",
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + DRAFT_EXPIRY_DAYS);

    const draft = await Draft.create({
      formId: id,
      values,
      resumeToken: randomUUID(),
      expiresAt,
    });

    return res.status(201).json({
      message: "Draft saved",
      savedAt: draft.createdAt,
      resumeToken: draft.resumeToken,
      expiresAt: draft.expiresAt,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to save draft",
    });
  }
}

// Resume drafts by their public token, not their internal MongoDB id.
async function getDraft(req, res) {
  const { id, resumeToken } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      error: "Draft not found",
    });
  }

  if (typeof resumeToken !== "string" || !resumeToken.trim()) {
    return res.status(404).json({
      error: "Draft not found",
    });
  }

  try {
    const draft = await Draft.findOne({ formId: id, resumeToken }).lean();

    if (!draft) {
      return res.status(404).json({
        error: "Draft not found",
      });
    }

    if (new Date(draft.expiresAt).getTime() <= Date.now()) {
      return res.status(410).json({
        error: "This draft has expired",
      });
    }

    return res.status(200).json(draft);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch draft",
    });
  }
}

module.exports = {
  DRAFT_EXPIRY_DAYS,
  saveDraft,
  getDraft,
};
