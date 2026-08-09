const path = require("path");
const mongoose = require(path.join(
  __dirname,
  "backend",
  "node_modules",
  "mongoose"
));
const dotenv = require(path.join(
  __dirname,
  "backend",
  "node_modules",
  "dotenv"
));

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

  const createdForm = await Form.create(sampleForm);
  console.log("Seeded form id:", createdForm._id.toString());
  console.log("Seeded form title:", createdForm.title);

  const savedForm = await Form.findById(createdForm._id).lean();
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
