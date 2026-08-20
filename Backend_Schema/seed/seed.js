const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Form = require("../models/Form");
const { connectMongo, disconnectMongo } = require("../db");

dotenv.config();

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
          "honda"
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
          "vehicle damage"
        ],
      },
      {
        name: "hasInsurance",
        label: "Do you have insurance?",
        type: "dropdown",
        required: true,
        order: 4,
        aliases: ["insurance", "insured", "insurance status"],
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
          "insurance company"
        ],
      },
      {
        name: "terms",
        label: "I confirm the information is correct",
        type: "checkbox",
        required: true,
        order: 6,
        aliases: ["confirmation", "confirm details", "consent"],
      },
    ],
  },

  {
    title: "Vehicle Registration",
    description: "Collect vehicle registration information.",
    fields: [
      {
        name: "ownerName",
        label: "Owner Name",
        type: "text",
        required: true,
        order: 1,
        aliases: ["owner", "vehicle owner", "registered owner"],
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
          "automobile type"
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
          "vehicle plate"
        ],
      },
      {
        name: "terms",
        label: "I confirm the vehicle details",
        type: "checkbox",
        required: true,
        order: 4,
        aliases: ["confirmation", "consent", "confirm vehicle"],
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

    // Remove old sample forms
    await Form.deleteMany({});

    console.log("Old forms removed");

    // Insert new sample forms
    const createdForms = await Form.insertMany(forms);

    console.log(`${createdForms.length} forms inserted successfully`);

    createdForms.forEach((form) => {
      console.log(`- ${form.title}`);
    });

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

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };