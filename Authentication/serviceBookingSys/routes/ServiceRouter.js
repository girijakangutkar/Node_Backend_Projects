const express = require("express");
const ServiceModel = require("../model/ServiceModel");
const authMiddleware = require("../middleware/authMiddleware");
const ServiceRouter = express.Router();

ServiceRouter.get(
  "/bookings",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      let query = {};
      if (req.role === "user") {
        query.userId = req.user;
      }
      const services = await ServiceModel.find(query);
      res.status(200).json({ msg: "Success", services });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

ServiceRouter.post("/bookings", authMiddleware(["user"]), async (req, res) => {
  try {
    const newBooking = { ...req.body, userId: req.user };
    let services = await ServiceModel.create(newBooking);
    res.status(201).json({ msg: "added successfully", services });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

ServiceRouter.put(
  "/booking/:id",
  authMiddleware(["user"]),
  async (req, res) => {
    try {
      let serviceId = req.params.id;
      let updateBooking = req.body;
      const findBooking = await ServiceModel.findById(serviceId);
      if (findBooking.userId.toString() !== req.user) {
        return res
          .status(403)
          .json({ msg: "Unauthorized to update this booking" });
      }

      if (!findBooking) {
        return res.status(404).json({ msg: "Service does not exists" });
      }
      if ("bookingStatus" in updateBooking) {
        return res.status(401).json({ msg: "You cannot edit booking status" });
      }
      if (findBooking.bookingStatus !== "pending") {
        return res
          .status(400)
          .json({ msg: "Only pending bookings can be updated" });
      }

      let updateIt = await ServiceModel.findByIdAndUpdate(
        serviceId,
        updateBooking,
        { new: true }
      );
      res.status(200).json({ msg: "Updated successfully", updateIt });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

ServiceRouter.patch(
  "/booking/:id/cancel",
  authMiddleware(["user"]),
  async (req, res) => {
    try {
      let serviceId = req.params.id;
      const findService = await ServiceModel.findById(serviceId);
      if (!findService) {
        return res.status(404).json({ msg: "Service does not exists" });
      }
      let patchStatus = await ServiceModel.findByIdAndUpdate(
        serviceId,
        {
          bookingStatus: "cancelled",
        },
        { new: true }
      );
      res.status(200).json({ msg: "cancelled booking", patchStatus });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

ServiceRouter.delete(
  "/booking/:id",
  authMiddleware(["admin"]),
  async (req, res) => {
    try {
      let serviceId = req.params.id;
      let findService = await ServiceModel.findById(serviceId);
      if (!findService) {
        return res.status(404).json({ msg: "Service does not exists" });
      }
      await ServiceModel.findByIdAndDelete(serviceId);
      res.status(200).json({ msg: "Deleted successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

ServiceRouter.patch(
  "/booking/:id/approve",
  authMiddleware(["admin"]),
  async (req, res) => {
    try {
      let serviceId = req.params.id;
      const findService = await ServiceModel.findById(serviceId);
      if (!findService) {
        return res.status(404).json({ msg: "Service does not exists" });
      }
      let patchStatus = await ServiceModel.findByIdAndUpdate(
        serviceId,
        {
          bookingStatus: "approved",
        },
        { new: true }
      );
      res.status(200).json({ msg: "Approved booking", patchStatus });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

ServiceRouter.patch(
  "/booking/:id/reject",
  authMiddleware(["admin"]),
  async (req, res) => {
    try {
      let serviceId = req.params.id;
      const findService = await ServiceModel.findById(serviceId);
      if (!findService) {
        return res.status(404).json({ msg: "Service does not exists" });
      }
      let patchStatus = await ServiceModel.findByIdAndUpdate(
        serviceId,
        {
          bookingStatus: "rejected",
        },
        { new: true }
      );
      res.status(200).json({ msg: "Approved booking", patchStatus });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

module.exports = ServiceRouter;
