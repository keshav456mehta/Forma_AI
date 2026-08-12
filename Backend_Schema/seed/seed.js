const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Form = require("../models/Form");
const { connectMongo } = require("../db");

dotenv.config();


// SAMPLE FORMS


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
        order: 1
      },
      {
        name: "country",
        label: "Country",
        type: "dropdown",
        required: true,
        order: 2
      },
      {
        name: "terms",
        label: "I agree to the terms",
        type: "checkbox",
        required: true,
        order: 3
      }
    ]
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
        order: 1
      },
      {
        name: "hasInsurance",
        label: "Do you have insurance?",
        type: "dropdown",
        required: true,
        order: 2
      },
      {
        name: "insuranceCompany",
        label: "Insurance Company",
        type: "text",
        required: true,
        order: 3,
        showIf: {
          fieldId: "hasInsurance",
          equals: "Yes"
        }
      },
      {
        name: "terms",
        label: "I confirm the information is correct",
        type: "checkbox",
        required: true,
        order: 4
      }
    ]
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
        order: 1
      },
      {
        name: "vehicleType",
        label: "Vehicle Type",
        type: "dropdown",
        required: true,
        order: 2
      },
      {
        name: "vehicleNumber",
        label: "Vehicle Number",
        type: "text",
        required: true,
        order: 3,
        validationRegex: "^[A-Z]{2}[0-9]{4}$"
      },
      {
        name: "terms",
        label: "I confirm the vehicle details",
        type: "checkbox",
        required: true,
        order: 4
      }
    ]
  }
];

// SEED DATABASE


const seedDatabase = async () => {
  try {
    await connectMongo();

    console.log("MongoDB connected");

    // Remove old sample forms
    await Form.deleteMany({});

    console.log("Old forms removed");

    // Insert 3 new forms
    const createdForms = await Form.insertMany(forms);

    console.log(`${createdForms.length} forms inserted successfully`);

    createdForms.forEach((form) => {
      console.log(`- ${form.title}`);
    });

    await mongoose.connection.close();

    console.log("Database connection closed");
    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Seed failed:", error.message);

    if (error.atlasError) {
      console.error("Atlas connection error:", error.atlasError.message);
    }

    if (error.code === "ECONNREFUSED") {
      console.error(
        "Local MongoDB is not running at 127.0.0.1:27017. Start MongoDB or set MONGO_FALLBACK=false to avoid local fallback."
      );
    }

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
};

seedDatabase();