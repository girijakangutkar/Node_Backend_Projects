const { readTasks, writeTask } = require("../models/task.model");

const getTask = (req, res) => {
  let taskList = readTasks();
  if (taskList.length > 0) {
    res.status(200).json({ msg: "Success", taskDetails: taskList });
  } else {
    res.status(404).json({ msg: "List is empty" });
  }
};

const filterTask = (req, res) => {
  let searchQuery = req.query.tag?.toLowerCase();
  let list = readTasks();
  let matched = list.filter((items) => {
    return items.tag.toLowerCase().includes(searchQuery);
  });

  if (matched.length > 0) {
    res.status(200).json({ msg: "Success", taskDetails: matched });
  } else {
    res.status(404).json({ msg: "Not found" });
  }
};

const addTask = (req, res) => {
  let newTask = req.body;
  let list = readTasks();
  let id = list[list.length - 1].id + 1;
  newTask = { id, ...newTask };
  list.push(newTask);
  writeTask(list);
  res.status(201).json({ msg: "Task added successfully", taskDetails: list });
};

const updateTask = (req, res) => {
  let id = req.params.id;
  let list = readTasks();
  let index = list.findIndex((items) => {
    return items.id == id;
  });
  if (index == -1) {
    res.status(404).json({ msg: "Does not Exists" });
  } else {
    list[index] = { ...list[index], ...req.body };
    writeTask(list);
    res.status(200).json({ msg: "Success", taskDetails: list[index] });
  }
};

const deleteTask = (req, res) => {
  let id = req.params.id;
  let list = readTasks();
  let index = list.findIndex((items) => items.id == id);
  if (index == -1) {
    res.status(404).json({ msg: "This task does not exists" });
  } else {
    list.splice(index, 1);
    writeTask(list);
    res.status(200).json({ msg: "Deleted successfully", taskDetails: list });
  }
};

module.exports = { getTask, filterTask, addTask, updateTask, deleteTask };
