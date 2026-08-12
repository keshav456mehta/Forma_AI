const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectMongo, disconnectMongo } = require("./db");
const formRoutes = require("./routes/formRoutes");

// Load environment variables
dotenv.config();

const app = express();


// MIDDLEWARE


app.use(cors());
app.use(express.json());


// BASIC ROUTE


app.get("/", (req, res) => {
  res.json({
    message: "Forma AI API is running",
  });
});


// FORM ROUTES


app.use("/api/forms", formRoutes);


// 404 HANDLER


app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});


// MONGODB CONNECTION

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectMongo();
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    if (error.atlasError) {
      console.error("Atlas connection error:", error.atlasError.message);
    }
    console.error(
      "If using Atlas, add your current IP to Atlas Network Access or disable fallback with MONGO_FALLBACK=false."
    );
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  await disconnectMongo();
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();