const express = require("express");
const router = express.Router();
const {
  getAllEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");
const { authEmployee } = require("../middleware/employee.middleware");

router.post("/employee", authEmployee("create"), createEmployee);

router.put("/employee/:id", authEmployee("update"), updateEmployee);

router.delete("/employee/:id", authEmployee("delete"), deleteEmployee);

router.get("/employee", authEmployee("read"), getAllEmployee);

module.exports = router;
