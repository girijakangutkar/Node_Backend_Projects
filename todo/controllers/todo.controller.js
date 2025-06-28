const { readTodo, writeTodo } = require("../models/todo.model");

const getTodos = (req, res) => {
  let getTodo = JSON.parse(readTodo());
  if (getTodo.length > 0) {
    res.status(200).json({ msg: "Success", getTodo });
  } else {
    res.status(404).json({ msg: "Todo is empty" });
  }
};

const addTodo = (req, res) => {
  let newData = req.body;
  let list = JSON.parse(readTodo());
  let id = list[list.length - 1].id + 1;
  newData = { id, ...newData };
  list.push(newData);
  writeTodo(list);
  res.status(201).json({ msg: "Success", todoDetails: newData });
};

const searchTodo = (req, res) => {
  let searchQuery = req.query.title?.toLowerCase();
  let list = JSON.parse(readTodo());
  let todoList = list;
  const matched = todoList.filter((item) =>
    item.title.toLowerCase().includes(searchQuery)
  );

  if (matched.length > 0) {
    res.status(200).json({ msg: "Success", todoDetails: matched });
  } else {
    res.status(404).json({ msg: "Not found!" });
  }
};

const updateStatus = (req, res) => {
  let id = req.params.id;
  let list = JSON.parse(readTodo());
  let index = list.findIndex((items) => items.id == id);

  if (index == -1) {
    res.status(404).json({ msg: "Not found" });
  } else {
    if (list[index].completed == false) {
      list[index].completed = true;
      writeTodo();
      return res.status(200).json({ msg: "Success", todoDetails: list[index] });
    } else {
      return res.status(404).json({ msg: "Already marked as completed" });
    }
  }
};

const deleteTodo = (req, res) => {
  let id = req.params.id;
  let list = JSON.parse(readTodo());
  let index = list.findIndex((item) => item.id == id);

  if (index == -1) {
    res.status(404).json({ msg: "Not found" });
  }
  list.splice(index, 1);
  writeTodo();
  res.status(200).json({ msg: "Success", todoDetails: list[index] });
};

module.exports = { getTodos, addTodo, searchTodo, updateStatus, deleteTodo };
