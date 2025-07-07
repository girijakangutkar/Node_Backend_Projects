const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Doctor", DoctorSchema);
