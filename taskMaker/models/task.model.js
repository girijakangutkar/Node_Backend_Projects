const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../task.json");

const readTasks = () => {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeTask = (list) => {
  return fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
};

module.exports = { readTasks, writeTask };
