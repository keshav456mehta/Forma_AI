const express = require("express");
const { getFormById } = require("../controllers/formController");

const router = express.Router();

router.get("/:id", getFormById);

module.exports = router;
