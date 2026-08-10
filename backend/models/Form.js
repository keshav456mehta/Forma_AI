const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
    showIf: {
      fieldId: {
        type: String,
      },
      equals: {
        type: String,
      },
    },
    validationRegex: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    fields: {
      type: [fieldSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.models.Form || mongoose.model("Form", formSchema);

module.exports = Form;
