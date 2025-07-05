const express = require("express");
const VehicleModel = require("../models/VehicleModel");
const AnalysisRouter = express.Router();

AnalysisRouter.get("/tripDistance", async (req, res) => {
  try {
    const vehicles = await VehicleModel.find({
      "trips.distance": { $gt: 200 },
    });
    res.status(200).json({ msg: "Success", vehicles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

AnalysisRouter.get("/findVehicles", async (req, res) => {
  try {
    const findCarAndTruck = await VehicleModel.find({
      type: { $in: ["car", "truck"] },
    });
    res.status(200).json({ msg: "Success", findCarAndTruck });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

AnalysisRouter.get("/tripAfter", async (req, res) => {
  try {
    const janFirst2024 = new Date("2024-01-01T00:00:00Z");
    const findCarAndTruck = await VehicleModel.find({
      "trips.startTime": {
        $gte: janFirst2024,
      },
    });
    res.status(200).json({ msg: "Success", findCarAndTruck });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

AnalysisRouter.get("/lastTrip", async (req, res) => {
  try {
    const findCarAndTruck = await VehicleModel.find({
      "trips.startLocation": { $in: ["Delhi", "Mumbai", "Banglore"] },
    });
    res.status(200).json({ msg: "Success", findCarAndTruck });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = AnalysisRouter;
