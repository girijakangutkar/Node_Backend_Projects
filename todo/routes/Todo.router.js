const express = require("express");
const {
  getTodos,
  addTodo,
  searchTodo,
  updateStatus,
  deleteTodo,
} = require("../controllers/todo.controller");

const router = express.Router();

// get all todos
router.get("/todos", getTodos);

//post todos
router.post("/todos", addTodo);

//Retrieve by query
router.get("/searchQuery", searchTodo);

//Update by id
router.put("/todos/:id", updateStatus);

//Delete
router.delete("/todos/:id", deleteTodo);

module.exports = router;
