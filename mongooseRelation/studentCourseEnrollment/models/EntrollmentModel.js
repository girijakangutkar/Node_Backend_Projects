const mongoose = require("mongoose");

const JunctionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "student" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
  enrolledAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const JunctionModel = mongoose.model("junction", JunctionSchema);

module.exports = JunctionModel;
