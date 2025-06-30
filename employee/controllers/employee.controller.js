const express = require("express");
const { readFile, writeFile } = require("../models/employee.model");

const getAllEmployee = (req, res) => {
  let allEmployee = readFile();
  if (allEmployee.length > 0) {
    res.status(200).json({ msg: "Success", employeeDetails: allEmployee });
  } else {
    res.status(404).json({ msg: "List is empty" });
  }
};

const createEmployee = (req, res) => {
  let newEmployee = req.body;
  let list = readFile();
  let id = list.length > 0 ? list[list.length - 1].id + 1 : 1;
  newEmployee = { id, ...newEmployee };
  list.push(newEmployee);
  writeFile(list);
  res.status(201).json({ msg: "Success", employeeDetails: list });
};

const updateEmployee = (req, res) => {
  let id = req.params.id;
  let list = readFile();
  let index = list.findIndex((items) => {
    return items.id == id;
  });

  if (index == -1) {
    res.status(404).json({ msg: "Employee dose not exits" });
  } else {
    list[index] = { ...list[index], ...req.body };
    writeFile(list);
    res.status(200).json({ msg: "Success", employeeDetails: list });
  }
};

const deleteEmployee = (req, res) => {
  let id = req.params.id;
  let list = readFile();
  let index = list.findIndex((item) => {
    return item.id == id;
  });

  if (index == -1) {
    res.status(404).json({ err: "Employee does not exist." });
  } else {
    list.splice(index, 1);
    writeFile(list);
    res.status(200).json({ msg: "Success", employeeDetails: list });
  }
};

module.exports = {
  getAllEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
