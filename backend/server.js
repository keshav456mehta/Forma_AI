const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const formRoutes = require("./routes/formRoutes");
const draftRoutes = require("./routes/draftRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Keep malformed JSON responses in the same public error contract as every
// route-level validation failure. Express otherwise sends its default HTML
// error document before requests reach a route handler.
app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Malformed JSON request body" });
  }

  return next(error);
});

app.get("/", (_req, res) => {
  res.json({ message: "server is running" });
});

app.use("/api/forms", formRoutes);
app.use("/api/drafts", draftRoutes);

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