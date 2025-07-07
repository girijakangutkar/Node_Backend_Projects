const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  isActive: { type: Boolean, default: true },
});

const StudentModel = mongoose.model("student", StudentSchema);

module.exports = StudentModel;
// 686b93a64024134c3a275784 girija

// 686b93bb4024134c3a275786 gauri

// 686b94a5aa84b75eaeafb71f intro to readt
