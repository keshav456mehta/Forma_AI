const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const formRoutes = require("./routes/formRoutes");
require("./services/extractionService");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "server is running" });
});

app.use("/api/forms", formRoutes);

async function startServer() {
  try {
    if (!MONGODB_URI) {
      console.warn(
        "MongoDB URI missing. Add MONGODB_URI or MONGO_URI to backend/.env."
      );
    } else {
      await mongoose.connect(MONGODB_URI);
      console.log("MongoDB connected");
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
