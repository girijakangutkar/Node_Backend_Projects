const express = require("express");
const TaskModel = require("../models/task.model");
const taskRouter = express.Router();

taskRouter.get("/taskList", async (req, res) => {
  try {
    const tasks = await TaskModel.find({});
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

taskRouter.post("/addTask", async (req, res) => {
  try {
    const newTask = await TaskModel.create(req.body);
    res.status(200).json({ msg: "Success", newTask });
  } catch (err) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

taskRouter.patch("/updateTask/:id", async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task cannot be found!" });
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ msg: "Task updated", updatedTask });
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

taskRouter.delete("/deleteTask/:id", async (req, res) => {
  let task = await TaskModel.findById(req.params.id);
  if (!task) {
    res.status(404).json({ Error: "Task does not exits with this ID" });
  } else {
    await TaskModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Deleted successfully!" });
  }
});

module.exports = taskRouter;
