const express = require("express");
const VehicleModel = require("../models/VehicleModel");
const VehicleRoutes = express.Router();

VehicleRoutes.get("/list", async (req, res) => {
  try {
    const data = await VehicleModel.find({});
    res.status(200).json({ msg: "Success", data });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

VehicleRoutes.post("/add-vehicle", async (req, res) => {
  try {
    const newVehicle = req.body;
    const data = await VehicleModel.create(newVehicle);
    res.status(201).json({ msg: "Vehicle details added successfully", data });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

VehicleRoutes.put("/update-vehicle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await VehicleModel.findByIdAndUpdate(id, req.body);
    res.status(200).json({ msg: "updated" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

VehicleRoutes.delete("/delete-vehicle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await VehicleModel.findByIdAndDelete(id, req.body);
    res.status(200).json({ msg: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = VehicleRoutes;
