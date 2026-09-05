const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const Form = require("../models/Form");
const Draft = require("../models/Draft");

const DRAFT_EXPIRY_DAYS = 30;

function draftResponse(draft) {
  return {
    message: "Draft saved",
    savedAt: draft.createdAt,
    resumeToken: draft.resumeToken,
    expiresAt: draft.expiresAt,
    revision: draft.revision,
  };
}

async function saveDraft(req, res) {
  const { id } = req.params;
  const values = req.body?.values;
  const resumeToken = req.body?.resumeToken;
  const revision = req.body?.revision;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid form ID" });
  }

  if (typeof values !== "object" || values === null) {
    return res.status(400).json({ error: "values is required" });
  }

  if (resumeToken !== undefined && (typeof resumeToken !== "string" || !resumeToken.trim())) {
    return res.status(400).json({ error: "resumeToken must be a non-empty string" });
  }

  if (resumeToken !== undefined && (!Number.isInteger(revision) || revision < 1)) {
    return res.status(400).json({ error: "revision must be a positive integer" });
  }

  try {
    const form = await Form.findById(id).lean();

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Every save refreshes the resume window; an update also checks revision
    // so two clients cannot silently overwrite one another's draft.
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + DRAFT_EXPIRY_DAYS);

    if (resumeToken) {
      const draft = await Draft.findOneAndUpdate(
        { formId: id, resumeToken, revision },
        { $set: { values, expiresAt }, $inc: { revision: 1 } },
        { new: true }
      ).lean();

      if (!draft) {
        const existingDraft = await Draft.findOne({ formId: id, resumeToken }).lean();
        if (existingDraft) {
          return res.status(409).json({
            error: "Draft has been updated elsewhere. Reload it and try again.",
          });
        }

        return res.status(404).json({ error: "Draft not found" });
      }

      return res.status(200).json(draftResponse(draft));
    }

    const draft = await Draft.create({
      formId: id,
      values,
      resumeToken: randomUUID(),
      expiresAt,
    });

    return res.status(201).json(draftResponse(draft));
  } catch (_error) {
    return res.status(500).json({ error: "Failed to save draft" });
  }
}

async function getDraft(req, res) {
  const { id, resumeToken } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Draft not found" });
  }

  if (typeof resumeToken !== "string" || !resumeToken.trim()) {
    return res.status(404).json({ error: "Draft not found" });
  }

  try {
    const draft = await Draft.findOne({ formId: id, resumeToken }).lean();

    if (!draft) {
      return res.status(404).json({ error: "Draft not found" });
    }

    // Keep expired records long enough to report expiry rather than a vague
    // not-found response to a user opening an old resume link.
    if (new Date(draft.expiresAt).getTime() <= Date.now()) {
      return res.status(410).json({ error: "This draft has expired" });
    }

    return res.status(200).json(draft);
  } catch (_error) {
    return res.status(500).json({ error: "Failed to fetch draft" });
  }
}

module.exports = {
  DRAFT_EXPIRY_DAYS,
  saveDraft,
  getDraft,
};
