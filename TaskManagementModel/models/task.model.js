const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: Boolean,
  dueDate: Date,
});

const TaskModel = mongoose.model("task", TaskSchema);

module.exports = TaskModel;
