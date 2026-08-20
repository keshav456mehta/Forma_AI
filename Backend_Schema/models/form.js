const mongoose = require("mongoose");

// FIELD SCHEMA

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

    // CONDITIONAL LOGIC
    showIf: {
      fieldId: {
        type: String,
      },

      equals: {
        type: String,
      },
    },

    // VALIDATION
    validationRegex: {
      type: String,
    },
  },
  {
    _id: false,
  
  
  showIf: {
  fieldId: {
    type: String
  },
  equals: {
    type: String
  }
},

aliases: {
  type: [String],
  default: [],
},

validationRegex: {
  type: String
}}




);

// FORM SCHEMA

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


// FORM MODEL

const Form = mongoose.model("Form", formSchema);

module.exports = Form;