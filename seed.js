const path = require("path");
const { createRequire } = require("module");

// Resolve backend dependencies using Node's module resolution rules.
const backendRequire = createRequire(path.join(__dirname, "backend", "package.json"));
const mongoose = backendRequire("mongoose");
const dotenv = backendRequire("dotenv");

dotenv.config({ path: path.join(__dirname, "backend", ".env") });

const Form = require("./backend/models/Form");

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const sampleForms = [
  {
    title: "Basic Information",
    description: "Collect basic user information for onboarding.",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true, order: 1, aliases: ["name", "full name", "user name"] },
      { name: "email", label: "Email Address", type: "text", required: true, order: 2, aliases: ["email", "email address"] },
      {
        name: "department",
        label: "Department",
        type: "dropdown",
        required: false,
        order: 3,
        options: [
          { label: "Engineering", value: "Engineering" },
          { label: "Marketing", value: "Marketing" },
          { label: "Operations", value: "Operations" },
        ],
        aliases: ["department", "team"],
      },
    ],
  },

  {
    title: "Insurance Claim",
    description: "Collect insurance claim information.",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true, order: 1, aliases: ["name", "claimant name"] },
      { name: "vehicle", label: "Vehicle", type: "text", required: true, order: 2, aliases: ["car", "vehicle", "automobile"] },
      { name: "damage", label: "Damage", type: "text", required: true, order: 3, aliases: ["damaged", "broken", "damage details"] },
      {
        name: "hasInsurance",
        label: "Do you have insurance?",
        type: "dropdown",
        required: true,
        order: 4,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
        aliases: ["insurance", "insured"],
      },
      {
        name: "insuranceCompany",
        label: "Insurance Company",
        type: "text",
        required: true,
        order: 5,
        showIf: { fieldId: "hasInsurance", equals: "Yes" },
        aliases: ["insurer", "insurance provider"],
      },
      { name: "terms", label: "I confirm the information is correct", type: "checkbox", required: true, order: 6, aliases: ["confirmation", "consent"] },
    ],
  },

  {
    title: "Vehicle Registration",
    description: "Collect vehicle registration information.",
    fields: [
      { name: "ownerName", label: "Owner Name", type: "text", required: true, order: 1, aliases: ["owner", "vehicle owner", "registered owner"] },
      {
        name: "vehicleType",
        label: "Vehicle Type",
        type: "dropdown",
        required: true,
        order: 2,
        options: [
          { label: "Car", value: "Car" },
          { label: "Motorcycle", value: "Motorcycle" },
          { label: "Truck", value: "Truck" },
        ],
        aliases: ["vehicle category", "car type"],
      },
      {
        name: "vehicleNumber",
        label: "Vehicle Number",
        type: "text",
        required: true,
        order: 3,
        validationRegex: "^[A-Z]{2}[0-9]{4}$",
        aliases: ["registration number", "license plate"],
      },
      { name: "terms", label: "I confirm the vehicle details", type: "checkbox", required: true, order: 4, aliases: ["confirmation", "consent"] },
    ],
  },

  {
    title: "Insurance Claim - Detailed",
    description: "Collect detailed insurance claim information with conditional branching.",
    fields: [
      {
        name: "hasInsurance",
        label: "Do you have insurance?",
        type: "dropdown",
        required: true,
        order: 1,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
        aliases: ["insurance", "insured"],
      },
      {
        name: "insuranceType",
        label: "What type of insurance do you have?",
        type: "dropdown",
        required: true,
        order: 2,
        options: [
          { label: "Comprehensive", value: "Comprehensive" },
          { label: "Third Party", value: "Third Party" },
        ],
        showIf: { fieldId: "hasInsurance", equals: "Yes" },
        aliases: ["insurance type", "policy type"],
      },
      {
        name: "insuranceCompany",
        label: "Insurance Company",
        type: "text",
        required: true,
        order: 3,
        showIf: { fieldId: "insuranceType", equals: "Comprehensive" },
        aliases: ["insurer", "insurance provider"],
      },
      {
        name: "policyNumber",
        label: "Policy Number",
        type: "text",
        required: true,
        order: 4,
        showIf: { fieldId: "insuranceCompany", equals: "ABC Insurance" },
        aliases: ["policy", "policy id"],
      },
      {
        name: "vehicleNumber",
        label: "Vehicle Number",
        type: "text",
        required: true,
        order: 5,
        validationRegex: "^[A-Z]{2}[0-9]{4}$",
        aliases: ["registration number", "vehicle plate"],
      },
      { name: "terms", label: "I confirm the claim information", type: "checkbox", required: true, order: 6, aliases: ["confirmation", "consent"] },
    ],
  },
];

async function seed() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI or MONGO_URI in backend/.env");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected for seeding");

  for (const formData of sampleForms) {
    const savedForm = await Form.findOneAndUpdate(
      { title: formData.title },
      formData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    console.log(`Seeded "${savedForm.title}" -> id: ${savedForm._id.toString()}`);
  }

  console.log(`Done. ${sampleForms.length} forms seeded.`);
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
