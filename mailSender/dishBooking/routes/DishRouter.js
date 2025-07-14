const express = require("express");
const DishModel = require("../models/DishModel");
const authMiddleware = require("../middleware/authMiddleware");
const DishRouter = express.Router();

DishRouter.get(
  "/dishes",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      const query = {};
      if (req.role == "user") {
        query.userId = req.user;
      }
      const getData = await DishModel.find(query);
      res.status(200).json({ msg: "Success", getData });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Something went wrong", error: error.message });
    }
  }
);

DishRouter.post(
  "/dishes",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      const newData = { ...req.body, userId: req.user };
      const addData = await DishModel.create(newData);
      res.status(201).json({ msg: "Order Received", addData });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Something went wrong", error: error.message });
    }
  }
);

DishRouter.put(
  "/dishes/:id",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      const dishId = req.params.id;
      const update = req.body;
      const findDish = await DishModel.findById(dishId);
      if (!findDish) {
        return res.status(404).json({ msg: "Dish does not exists" });
      }
      let updateDish;
      if (req.role == "user") {
        updateDish = await DishModel.findByIdAndUpdate(
          { _id: dishId, userId: req.user },
          update,
          { new: true }
        );
      } else {
        updateDish = await DishModel.findByIdAndUpdate(dishId, update, update, {
          new: true,
        });
      }
      res.status(200).json({ msg: "Dish updated", updateDish });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Something went wrong", error: error.message });
    }
  }
);

DishRouter.delete(
  "/dishes/:id",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      const dishId = req.params.id;
      const findDish = await DishModel.findById(dishId);
      if (!findDish) {
        return res.status(404).json({ msg: "Dish does not exists" });
      }
      if (req.role == "user") {
        await DishModel.findByIdAndDelete({
          _id: dishId,
          userId: req.user,
        });
      } else {
        await DishModel.findByIdAndDelete(dishId);
      }
      res.status(200).json({ msg: "Dish deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Something went wrong", error: error.message });
    }
  }
);

module.exports = DishRouter;
