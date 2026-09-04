const mongoose = require("mongoose");

const draftSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
      index: true,
    },

    partialValues: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    savedAt: {
      type: Date,
      default: Date.now,
    },

    resumeToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Stored as data so the resume endpoint can return
    // an explicit expiry response instead of treating the draft as missing.
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Draft =
  mongoose.models.Draft ||
  mongoose.model("Draft", draftSchema);

module.exports = Draft;