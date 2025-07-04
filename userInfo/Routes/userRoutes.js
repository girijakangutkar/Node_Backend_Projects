const express = require("express");
const UserModel = require("../models/userModel");

const userRouter = express.Router();

userRouter.get("/userList", async (req, res) => {
  try {
    const data = await UserModel.find({});

    if (data.length == 0) {
      res.status(404).json({ msg: "List is empty" });
    }
    res.status(200).json({ msg: "Success", data });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

userRouter.post("/addUser", async (req, res) => {
  try {
    const newData = req.body;
    const data = await UserModel.create(newData);
    res.status(201).json({ msg: "Added user successfully", data });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

userRouter.post("/addAddress/:id/address", async (req, res) => {
  try {
    const { id } = req.params;
    const addRes = await UserModel.findByIdAndUpdate(
      id,
      { $push: { address: req.body } },
      { new: true }
    );
    res
      .status(201)
      .json({ mag: "Added address to the particular user.", addRes });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

userRouter.get("/summary", async (req, res) => {
  try {
    const totalUser = await UserModel.countDocuments();
    const countAddress = await UserModel.countDocuments({
      address: { $exists: true, $not: { $size: 0 } },
    });
    const userDetails = await UserModel.find({}, { name: 1, address: 1 });
    res
      .status(200)
      .json({ msg: "Success", totalUser, countAddress, userDetails });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

userRouter.get("/userDetails/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundUser = await UserModel.findById(id);
    res.status(200).json({ msg: "Success", foundUser });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

userRouter.delete("/deleteAddress/:userId/:addressID", async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const data = await UserModel.findByIdAndDelete(
      userId,
      { $pull: { address: { _id: addressId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "success", data });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});
module.exports = userRouter;
