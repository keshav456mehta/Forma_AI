const express = require("express");
const { getFormById, submitForm } = require("../controllers/formController");

const router = express.Router();

// Keep the public form API grouped under /api/forms in server.js.
router.get("/:id", getFormById);
router.post("/:id/submit", submitForm);

module.exports = router;
