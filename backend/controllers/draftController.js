const mongoose = require("mongoose");
const Form = require("../models/Form");
const Draft = require("../models/Draft");

// Day 23: save a partially-filled form's current state so it can be
// resumed later. Stores a snapshot tied to the form's id; returns the
// draft's own id so the frontend can use it as a resume token/link.
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
    });

    return res.status(201).json({
      message: "Draft saved",
      draftId: draft._id,
      savedAt: draft.createdAt,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to save draft",
    });
  }
}

// Day 24 will use this to resume a draft; included now so Day 23's save
// flow has a matching read path to verify against.
async function getDraft(req, res) {
  const { draftId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(draftId)) {
    return res.status(400).json({
      error: "Invalid draft ID",
    });
  }

  try {
    const draft = await Draft.findById(draftId).lean();

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
