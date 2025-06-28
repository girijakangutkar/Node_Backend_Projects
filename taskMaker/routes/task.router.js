const express = require("express");
const {
  getTask,
  filterTask,
  addTask,
  deleteTask,
  updateTask,
} = require("../controllers/task.controller");

const router = express.Router();

router.get("/tasks", getTask);

router.get("/tasks/filter", filterTask);

router.post("/tasks", addTask);

router.put("/tasks/:id", updateTask);

router.delete("/tasks/:id", deleteTask);

module.exports = router;
