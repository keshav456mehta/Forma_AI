const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const Form = require("../models/Form");
const Draft = require("../models/Draft");

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

    const draft = await Draft.create({
      formId: id,
      values,
      resumeToken: randomUUID(),
    });

    return res.status(201).json({
      message: "Draft saved",
      savedAt: draft.createdAt,
      resumeToken: draft.resumeToken,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to save draft",
    });
  }
}

// Resume drafts by their public token, not their internal MongoDB id.
async function getDraft(req, res) {
  const { resumeToken } = req.params;

  if (typeof resumeToken !== "string" || !resumeToken.trim()) {
    return res.status(400).json({
      error: "resumeToken is required",
    });
  }

  try {
    const draft = await Draft.findOne({ resumeToken }).lean();

    if (!draft) {
      return res.status(404).json({
        error: "Draft not found",
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
  saveDraft,
  getDraft,
};
