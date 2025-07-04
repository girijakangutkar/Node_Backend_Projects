const express = require("express");
const TaskModel = require("../models/task.model");
const validateTask = require("../middleware/task.middleware");
const validatePriority = require("../middleware/task.priority");
const taskRouter = express.Router();

taskRouter.get("/tasks", async (req, res) => {
  try {
    const task = await TaskModel.find({});

    if (task.length == 0) {
      res.status(404).json({ error: "Task list is empty" });
    }
    res.status(200).json({ msg: "Task list", task });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

taskRouter.post("/tasks", validateTask, validatePriority, async (req, res) => {
  try {
    let newTask = req.body;
    const task = await TaskModel.create(newTask);
    res.status(200).json({ msg: "New task added successfully", task });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

taskRouter.patch("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    if (!id) {
      return res.status(404).json({ error: "Id is not present" });
    }

    if (newData.status == true) {
      newData.completionDate = new Date();
    }
    const updated = await TaskModel.findByIdAndUpdate(id, newData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ msg: "Success", updated });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

taskRouter.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const deletedTask = await TaskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ msg: "Deleted successfully", deletedTask });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = taskRouter;
