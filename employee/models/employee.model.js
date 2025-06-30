const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../db.json");

const readFile = () => {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeFile = (list) => {
  return fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
};

module.exports = { readFile, writeFile };
