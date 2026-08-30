const mongoose = require("mongoose");

const draftSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    values: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Draft = mongoose.models.Draft || mongoose.model("Draft", draftSchema);

module.exports = Draft;
