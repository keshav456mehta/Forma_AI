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
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = configuredOrigins.length
  ? configuredOrigins
  : process.env.NODE_ENV === "production"
    ? []
    : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header, such as health checks and server-to-
    // server calls, are not browser CORS requests and remain allowed.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
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
    // The extraction endpoint can operate without the database; form and
    // draft endpoints still return their normal database-backed errors.
  } else {
    try {
      await mongoose.connect(MONGODB_URI);
    } catch (_error) {
      // Start the HTTP service so extraction remains available when MongoDB
      // is temporarily unavailable; database routes fail through their API
      // error contract instead of crashing the process.
    }
  }

  app.listen(PORT);
}

startServer();
