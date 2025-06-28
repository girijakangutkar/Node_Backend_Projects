const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../db.json");

const readTodo = () => {
  return fs.readFileSync(filePath, "utf-8");
};

const writeTodo = (list) => {
  return fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
};

module.exports = { readTodo, writeTodo };
