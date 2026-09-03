const mongoose = require("mongoose");

const draftSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
<<<<<<< HEAD

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

=======
    },
=======
      index: true,
    },

>>>>>>> origin/main
    values: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    resumeToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Retained as data (rather than a TTL index) so the resume endpoint can
    // return an explicit expiry response instead of treating it as missing.
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
<<<<<<< HEAD

=======
>>>>>>> origin/main
  },
  {
    timestamps: true,
  }
);

<<<<<<< HEAD

=======
>>>>>>> origin/main
const Draft =
  mongoose.models.Draft ||
  mongoose.model("Draft", draftSchema);

<<<<<<< HEAD
module.exports = Draft;
=======
const Draft = mongoose.models.Draft || mongoose.model("Draft", draftSchema);

module.exports = Draft;

=======
module.exports = Draft;
>>>>>>> origin/main
