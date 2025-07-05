const express = require("express");
const VehicleModel = require("../models/VehicleModel");
const VehicleRoutes = express.Router();

VehicleRoutes.get("/list", async (req, res) => {
  try {
    const data = await VehicleModel.find({});
    res.status(200).json({ msg: "Success", data });
  } catch (error) {
    console.log(error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        error: messages.join(", "),
      });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
});

VehicleRoutes.post("/add-vehicle", async (req, res) => {
  try {
    const newVehicle = req.body;
    const data = await VehicleModel.create(newVehicle);
    res.status(201).json({ msg: "Vehicle details added successfully", data });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: `Duplicate value for field '${field}': '${error.keyValue[field]}' already exists.`,
      });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
});

VehicleRoutes.put("/update-vehicle/:vehicleId", async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const data = await VehicleModel.findByIdAndUpdate(vehicleId, req.body, {
      new: true,
    });
    res.status(200).json({ msg: "updated" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

VehicleRoutes.delete("/delete-vehicle/:vehicleId", async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const data = await VehicleModel.findByIdAndDelete(vehicleId, req.body);
    res.status(200).json({ msg: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

VehicleRoutes.put("/add-trip/:vehicleId", async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const data = req.body;
    const trip = await VehicleModel.findByIdAndUpdate(
      vehicleId,
      {
        $push: { trips: data },
      },
      { new: true }
    );

    res.status(201).json({ msg: "Added trip", trip });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

VehicleRoutes.delete("/delete-trip/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    await VehicleModel.updateOne(
      { "trips._id": tripId },
      { $pull: { trips: { _id: tripId } } }
    );
    res.status(200).json({ msg: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = VehicleRoutes;
