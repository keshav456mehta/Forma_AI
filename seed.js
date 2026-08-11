const path = require("path");
const { createRequire } = require("module");

// Resolve backend dependencies using Node's module resolution rules.
const backendRequire = createRequire(path.join(__dirname, "backend", "package.json"));
const mongoose = backendRequire("mongoose");
const dotenv = backendRequire("dotenv");

dotenv.config({ path: path.join(__dirname, "backend", ".env") });

const Form = require("./backend/models/Form");

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const sampleForm = {
  title: "Basic Information",
  description: "Collect basic user information for onboarding.",
  fields: [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      required: true,
      order: 1,
    },
    {
      name: "email",
      label: "Email Address",
      type: "text",
      required: true,
      order: 2,
    },
    {
      name: "department",
      label: "Department",
      type: "dropdown",
      required: false,
      order: 3,
    },
  ],
};

async function seed() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI or MONGO_URI in backend/.env");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected for seeding");

  const savedForm = await Form.findOneAndUpdate(
    { title: sampleForm.title },
    sampleForm,
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  ).lean();

  console.log("Seeded form id:", savedForm._id.toString());
  console.log("Seeded form title:", savedForm.title);
  console.log("Verified saved form:", JSON.stringify(savedForm, null, 2));
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
