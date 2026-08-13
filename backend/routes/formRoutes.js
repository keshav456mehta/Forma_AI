const express = require("express");
const { getFormById, submitForm } = require("../controllers/formController");

const router = express.Router();

router.get("/:id", getFormById);
router.post("/:id/submit", submitForm);

module.exports = router;
