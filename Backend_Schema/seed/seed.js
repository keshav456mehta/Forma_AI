const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const Form = require("../models/Form");
const { connectMongo, disconnectMongo } = require("../db");

dotenv.config({
  path: path.join(__dirname, ".env"),
});

// ==========================================
// DRAFT SCHEMA
// ==========================================

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
  },
  {
    timestamps: true,
  }
);

const Draft =
  mongoose.models.Draft ||
  mongoose.model("Draft", draftSchema);

// ==========================================
// SAMPLE FORMS
// ==========================================

const forms = [
  {
    title: "Basic Information",
    description: "Collect basic user information.",
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        required: true,
        order: 1,
        aliases: ["name", "full name", "user name"],
      },
      {
        name: "country",
        label: "Country",
        type: "dropdown",
        required: true,
        order: 2,
        aliases: ["nation", "country name"],
      },
      {
        name: "terms",
        label: "I agree to the terms",
        type: "checkbox",
        required: true,
        order: 3,
        aliases: ["agreement", "consent", "terms agreement"],
      },
    ],
  },

  {
    title: "Insurance Claim",
    description: "Collect insurance claim information.",
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        required: true,
        order: 1,
        aliases: ["name", "claimant name"],
      },
      {
        name: "vehicle",
        label: "Vehicle",
        type: "text",
        required: true,
        order: 2,
        aliases: [
          "car",
          "vehicle",
          "automobile",
          "honda",
        ],
      },
      {
        name: "damage",
        label: "Damage",
        type: "text",
        required: true,
        order: 3,
        aliases: [
          "damaged",
          "broken",
          "damage details",
          "vehicle damage",
        ],
      },
      {
        name: "hasInsurance",
        label: "Do you have insurance?",
        type: "dropdown",
        required: true,
        order: 4,
        aliases: [
          "insurance",
          "insured",
          "insurance status",
        ],
      },
      {
        name: "insuranceCompany",
        label: "Insurance Company",
        type: "text",
        required: true,
        order: 5,
        showIf: {
          fieldId: "hasInsurance",
          equals: "Yes",
        },
        aliases: [
          "insurer",
          "insurance provider",
          "insurance company",
        ],
      },
      {
        name: "terms",
        label: "I confirm the information is correct",
        type: "checkbox",
        required: true,
        order: 6,
        aliases: [
          "confirmation",
          "confirm details",
          "consent",
        ],
      },
    ],
  },

  {
    title: "Vehicle Registration",
    description:
      "Collect vehicle registration information.",
    fields: [
      {
        name: "ownerName",
        label: "Owner Name",
        type: "text",
        required: true,
        order: 1,
        aliases: [
          "owner",
          "vehicle owner",
          "registered owner",
        ],
      },
      {
        name: "vehicleType",
        label: "Vehicle Type",
        type: "dropdown",
        required: true,
        order: 2,
        aliases: [
          "vehicle category",
          "car type",
          "automobile type",
        ],
      },
      {
        name: "vehicleNumber",
        label: "Vehicle Number",
        type: "text",
        required: true,
        order: 3,
        validationRegex: "^[A-Z]{2}[0-9]{4}$",
        aliases: [
          "registration number",
          "registration plate",
          "license plate",
          "vehicle plate",
        ],
      },
      {
        name: "terms",
        label: "I confirm the vehicle details",
        type: "checkbox",
        required: true,
        order: 4,
        aliases: [
          "confirmation",
          "consent",
          "confirm vehicle",
        ],
      },
    ],
  },

  // ==========================================
  // 3-LEVEL BRANCHING FORM
  // ==========================================

  {
    title: "Insurance Claim - Detailed",
    description:
      "Collect detailed insurance claim information with conditional branching.",
    fields: [
      {
        name: "hasInsurance",
        label: "Do you have insurance?",
        type: "dropdown",
        required: true,
        order: 1,
        aliases: ["insurance", "insured"],
      },

      {
        name: "insuranceType",
        label: "What type of insurance do you have?",
        type: "dropdown",
        required: true,
        order: 2,
        showIf: {
          fieldId: "hasInsurance",
          equals: "Yes",
        },
        aliases: [
          "insurance type",
          "policy type",
        ],
      },

      {
        name: "insuranceCompany",
        label: "Insurance Company",
        type: "text",
        required: true,
        order: 3,
        showIf: {
          fieldId: "insuranceType",
          equals: "Comprehensive",
        },
        aliases: [
          "insurer",
          "insurance provider",
        ],
      },

      {
        name: "policyNumber",
        label: "Policy Number",
        type: "text",
        required: true,
        order: 4,
        showIf: {
          fieldId: "insuranceCompany",
          equals: "ABC Insurance",
        },
        aliases: [
          "policy",
          "policy id",
        ],
      },

      {
        name: "vehicleNumber",
        label: "Vehicle Number",
        type: "text",
        required: true,
        order: 5,
        validationRegex: "^[A-Z]{2}[0-9]{4}$",
        aliases: [
          "registration number",
          "vehicle plate",
        ],
      },

      {
        name: "terms",
        label: "I confirm the claim information",
        type: "checkbox",
        required: true,
        order: 6,
        aliases: [
          "confirmation",
          "consent",
        ],
      },
    ],
  },
];

// ==========================================
// SEED DATABASE
// ==========================================

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectMongo();

    console.log("MongoDB connected");

    // Make sure mongoose connection is actually ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error(
        `MongoDB connection is not ready. State: ${mongoose.connection.readyState}`
      );
    }

    // ======================================
    // REMOVE OLD SAMPLE DATA
    // ======================================

    await Draft.deleteMany({});
    await Form.deleteMany({});

    console.log("Old forms and drafts removed");

    // ======================================
    // INSERT FORMS
    // ======================================

    const createdForms = await Form.insertMany(forms);

    console.log(
      `${createdForms.length} forms inserted successfully`
    );

    createdForms.forEach((form) => {
      console.log(`- ${form.title}`);
    });

    // ======================================
    // FIND FORMS
    // ======================================

    const basicForm = createdForms.find(
      (form) => form.title === "Basic Information"
    );

    const insuranceForm = createdForms.find(
      (form) => form.title === "Insurance Claim"
    );

    const detailedForm = createdForms.find(
      (form) =>
        form.title === "Insurance Claim - Detailed"
    );

    if (!basicForm || !insuranceForm || !detailedForm) {
      throw new Error(
        "Required sample forms were not created"
      );
    }

    // ======================================
    // SAMPLE DRAFTS
    // ======================================

    const sampleDrafts = [
      // ------------------------------------
      // Draft 1 - Almost empty
      // ------------------------------------

      {
        formId: basicForm._id,

        partialValues: {
          fullName: "Rahul Sharma",
        },

        savedAt: new Date(),

        resumeToken:
          "day25-basic-incomplete-rahul",
      },

      // ------------------------------------
      // Draft 2 - Partially completed
      // ------------------------------------

      {
        formId: insuranceForm._id,

        partialValues: {
          fullName: "Amit Kumar",
          vehicle: "Honda City",
          damage: "Front bumper damaged",
          hasInsurance: "Yes",
        },

        savedAt: new Date(),

        resumeToken:
          "day25-insurance-partial-amit",
      },

      // ------------------------------------
      // Draft 3 - 3-level branching
      // ------------------------------------

      {
        formId: detailedForm._id,

        partialValues: {
          hasInsurance: "Yes",
          insuranceType: "Comprehensive",
          insuranceCompany: "ABC Insurance",
          policyNumber: "POL-123456",
          vehicleNumber: "DL1234",
        },

        savedAt: new Date(),

        resumeToken:
          "day25-3level-complete-demo",
      },
    ];

    // ======================================
    // INSERT DRAFTS
    // ======================================

    const createdDrafts =
      await Draft.insertMany(sampleDrafts);

    console.log(
      `${createdDrafts.length} sample drafts inserted successfully`
    );

    createdDrafts.forEach((draft, index) => {
      console.log(
        `Draft ${index + 1}: ${draft.resumeToken}`
      );
    });

    // ======================================
    // DISCONNECT
    // ======================================

    await disconnectMongo();

    console.log("Database connection closed");
    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Seed failed:", error.message);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

// ==========================================
// RUN DIRECTLY
// ==========================================

if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
};