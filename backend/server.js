const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const formRoutes = require("./routes/formRoutes");

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
  if (!MONGODB_URI) {
    console.warn(
      "MongoDB URI missing. Starting server without MongoDB."
    );
  } else {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("MongoDB connected");
    } catch (error) {
      console.warn(
        "MongoDB connection failed:",
        error.message
      );
      console.warn(
        "Starting server without MongoDB. Extraction API is still available."
      );
    }
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
