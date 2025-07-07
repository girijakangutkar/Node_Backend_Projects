const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  isActive: { type: Boolean, default: true },
});

const CourseModel = mongoose.model("course", CourseSchema);

module.exports = CourseModel;
