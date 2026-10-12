const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Form = require("./models/Form");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const forms = [
  {
    title: "Basic Information",
    description: "Collect basic user information.",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true, order: 1 },
      {
        name: "country",
        label: "Country",
        type: "dropdown",
        required: true,
        order: 2,
        options: [
          { label: "India", value: "India" },
          { label: "United States", value: "United States" },
          { label: "United Kingdom", value: "United Kingdom" },
        ],
      },
      { name: "terms", label: "I agree to the terms", type: "checkbox", required: true, order: 3 },
    ],
  },
  {
    title: "Insurance Claim",
    description: "Collect insurance claim information.",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true, order: 1 },
      {
        name: "hasInsurance",
        label: "Do you have insurance?",
        type: "dropdown",
        required: true,
        order: 2,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
      },
      {
        name: "insuranceCompany",
        label: "Insurance Company",
        type: "text",
        required: true,
        order: 3,
        showIf: { fieldId: "hasInsurance", equals: "Yes" },
      },
      { name: "terms", label: "I confirm the information is correct", type: "checkbox", required: true, order: 4 },
    ],
  },
  {
    title: "Vehicle Registration",
    description: "Collect vehicle registration information.",
    fields: [
      { name: "ownerName", label: "Owner Name", type: "text", required: true, order: 1 },
      {
        name: "vehicleType",
        label: "Vehicle Type",
        type: "dropdown",
        required: true,
        order: 2,
        options: [
          { label: "Car", value: "Car" },
          { label: "Bike", value: "Bike" },
          { label: "Truck", value: "Truck" },
        ],
      },
      {
        name: "vehicleNumber",
        label: "Vehicle Number",
        type: "text",
        required: true,
        order: 3,
        validationRegex: "^[A-Z]{2}[0-9]{4}$",
      },
      { name: "terms", label: "I confirm the vehicle details", type: "checkbox", required: true, order: 4 },
    ],
  },
];

async function seed() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI or MONGO_URI in backend/.env");
  }

  await mongoose.connect(MONGODB_URI);

  await Form.deleteMany({});

  await Form.insertMany(forms);
}

seed()
  .catch(() => {
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
