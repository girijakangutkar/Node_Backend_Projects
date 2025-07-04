const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  description: String,
  priority: { type: String, enum: ["low", "medium", "high"] },
  isCompleted: Boolean,
  completionDate: Date,
  dueDate: Date,
});

const TaskModel = mongoose.model("taskList", TaskSchema);

module.exports = TaskModel;
