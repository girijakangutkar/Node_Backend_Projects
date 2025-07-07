const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Patient", PatientSchema);
