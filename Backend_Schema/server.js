const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

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

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "formai",
  })
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });