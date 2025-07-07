const mongoose = require("mongoose");

const LearnerSchema = new mongoose.Schema({
  name: String,
  email: String,
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Learner", LearnerSchema);
