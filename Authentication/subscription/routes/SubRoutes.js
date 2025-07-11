const express = require("express");
const SubModel = require("../models/SubModel");
const authMiddleware = require("../middleware/authMiddleware");
const SubRouter = express.Router();

SubRouter.get(
  "/subscription-status",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      const query = {};
      if (req.role == "user") {
        query.userId = req.user;
      }
      const validation = await SubModel.find(query);
      res.status(200).json({ msg: "Success", validation });
    } catch (error) {
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

SubRouter.post(
  "/subscribe",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      const newSubscribe = { ...req.body, userId: req.user };
      let add = await SubModel.create(newSubscribe);
      res.status(201).json({ msg: "Added subscription", add });
    } catch (error) {
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

SubRouter.patch(
  "/renew/:id",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      const subId = req.params.id;
      const subscription = await SubModel.findById(subId);

      if (!subscription || subscription.userId.toString() !== req.user) {
        return res.status(403).json({ msg: "Unauthorized" });
      }

      const now = new Date();
      if (subscription.expiresOn > now) {
        return res.status(403).json({ msg: "No need to renew yet" });
      }

      subscription.expiresOn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await subscription.save();

      res.status(200).json({ msg: "Renew Completed", subscription });
    } catch (error) {
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

SubRouter.post(
  "/cancel-subscription/:id",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      const subId = req.params.id;
      const subscription = await SubModel.findById(subId);

      if (!subscription || subscription.userId.toString() !== req.user) {
        return res.status(403).json({ msg: "Unauthorized" });
      }

      subscription.status = "cancelled";
      subscription.expiresOn = null;
      await subscription.save();

      res.status(200).json({ msg: "Cancelled subscription", subscription });
    } catch (error) {
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

module.exports = SubRouter;
