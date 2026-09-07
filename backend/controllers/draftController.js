const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const Form = require("../models/Form");
const Draft = require("../models/Draft");
const { fallbackForm, shouldUseFallbackForm } = require("./formController");

const DRAFT_EXPIRY_DAYS = 30;
const localDrafts = new Map();

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

  // Drafts accept only an object payload; token and revision are required
  // together on updates so optimistic-concurrency checks are meaningful.
  if (typeof values !== "object" || values === null || Array.isArray(values)) {
    return res.status(400).json({ error: "values is required" });
  }

  if (resumeToken !== undefined && (typeof resumeToken !== "string" || !resumeToken.trim())) {
    return res.status(400).json({ error: "resumeToken must be a non-empty string" });
  }

  if (resumeToken !== undefined && (!Number.isInteger(revision) || revision < 1)) {
    return res.status(400).json({ error: "revision must be a positive integer" });
  }

  try {
    const useLocalDraftStore = process.env.NODE_ENV !== "test" &&
      (shouldUseFallbackForm() || id === fallbackForm._id);

    if (useLocalDraftStore) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + DRAFT_EXPIRY_DAYS);

      if (resumeToken) {
        const key = `${id}:${resumeToken}`;
        const draft = localDrafts.get(key);

        if (!draft) {
          return res.status(404).json({ error: "Draft not found" });
        }

        if (draft.revision !== revision) {
          return res.status(409).json({
            error: "Draft has been updated elsewhere. Reload it and try again.",
          });
        }

        draft.values = values;
        draft.expiresAt = expiresAt;
        draft.revision += 1;
        return res.status(200).json(draftResponse(draft));
      }

      const draft = {
        formId: fallbackForm._id,
        values,
        resumeToken: randomUUID(),
        createdAt: new Date(),
        expiresAt,
        revision: 1,
      };
      localDrafts.set(`${id}:${draft.resumeToken}`, draft);
      return res.status(201).json(draftResponse(draft));
    }

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
    const useLocalDraftStore = process.env.NODE_ENV !== "test" &&
      (shouldUseFallbackForm() || id === fallbackForm._id);

    if (useLocalDraftStore) {
      const draft = localDrafts.get(`${id}:${resumeToken}`);

      if (!draft) {
        return res.status(404).json({ error: "Draft not found" });
      }

      if (new Date(draft.expiresAt).getTime() <= Date.now()) {
        localDrafts.delete(`${id}:${resumeToken}`);
        return res.status(410).json({ error: "This draft has expired" });
      }

      return res.status(200).json(draft);
    }

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
