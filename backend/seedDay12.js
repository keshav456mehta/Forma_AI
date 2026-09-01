const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Form = require("./models/Form");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Day 12: 3-level conditional branching sample form
// Field A (vehicleType) → Field B (vehicleCategory) → Field C (vehicleModel)
// Only shows vehicleCategory if vehicleType = "Car"
// Only shows vehicleModel if vehicleCategory = "Sedan"
const forms = [
  {
    title: "Vehicle Registration - 3-Level Branching",
    description: "A form testing 3 levels of conditional field branching.",
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
        name: "vehicleCategory",
        label: "Vehicle Category",
        type: "dropdown",
        required: true,
        order: 3,
        showIf: { fieldId: "vehicleType", equals: "Car" },
        options: [
          { label: "Sedan", value: "Sedan" },
          { label: "SUV", value: "SUV" },
          { label: "Hatchback", value: "Hatchback" },
        ],
      },
      {
        name: "vehicleModel",
        label: "Vehicle Model",
        type: "text",
        required: true,
        order: 4,
        showIf: { fieldId: "vehicleCategory", equals: "Sedan" },
      },
      { name: "terms", label: "I confirm the vehicle details", type: "checkbox", required: true, order: 5 },
    ],
  },
];

async function seed() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI or MONGO_URI in backend/.env");
  }
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected for seeding");

  await Form.deleteMany({ title: "Vehicle Registration - 3-Level Branching" });
  console.log("Old 3-level form removed");

  const createdForms = await Form.insertMany(forms);
  console.log(`${createdForms.length} form inserted successfully`);

  createdForms.forEach((form) => {
    console.log(`- ${form.title} (${form._id})`);
  });
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log("Database connection closed");
  });