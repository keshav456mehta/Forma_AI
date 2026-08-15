const axios = require("axios");

const API_URL = process.env.API_URL || "http://localhost:5000/api/forms";

// Valid MongoDB ObjectId format that should not exist in the database.
const nonexistentFormId = "507f1f77bcf86cd799439011";

// Invalid MongoDB ObjectId.
const invalidFormId = "invalid-id";

async function testApi() {
  console.log("Running Forma AI API tests...\n");

  // Test 1: Invalid form ID should return 400.
  try {
    await axios.get(`${API_URL}/${invalidFormId}`);

    throw new Error(
      "Invalid ID unexpectedly returned a successful response."
    );
  } catch (error) {
    const status = error.response?.status;

    if (status !== 400) {
      throw new Error(
        `Expected status 400 for invalid ID, received ${
          status || "no response"
        }`
      );
    }

    if (error.response?.data?.error !== "Invalid form ID") {
      throw new Error("Unexpected response for invalid form ID.");
    }

    console.log("PASS: Invalid ID test passed");
  }

  // Test 2: Valid-format but nonexistent ID should return 404.
  try {
    await axios.get(`${API_URL}/${nonexistentFormId}`);

    throw new Error(
      "Nonexistent ID unexpectedly returned a successful response."
    );
  } catch (error) {
    const status = error.response?.status;

    if (status !== 404) {
      throw new Error(
        `Expected status 404 for nonexistent ID, received ${
          status || "no response"
        }`
      );
    }

    if (error.response?.data?.error !== "Form not found") {
      throw new Error("Unexpected response for nonexistent form.");
    }

    console.log("PASS: Nonexistent ID test passed");
  }

  console.log("\nAll API tests passed.");
}

testApi().catch((error) => {
  console.error("\nAPI test failed:");
  console.error(error.message);
  process.exit(1);
});