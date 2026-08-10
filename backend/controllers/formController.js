const mongoose = require("mongoose");
const Form = require("../models/Form");

async function getFormById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid form ID" });
  }

  try {
    const form = await Form.findById(id).lean();

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    return res.status(200).json(form);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch form",
      error: error.message,
    });
  }
}

module.exports = {
  getFormById,
};
