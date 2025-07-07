const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  name: String,
  expertise: String,
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Mentor", MentorSchema);
