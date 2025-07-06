const express = require("express");
const { UserModel, ProfileModel } = require("../models/UserModels");
const UserRouter = express.Router();

UserRouter.get("/userList", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json({ msg: "Success", userDetails: users });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

UserRouter.get("/profiles", async (req, res) => {
  try {
    const users = await ProfileModel.find({}).populate("user");
    res.status(200).json({ msg: "Success", userDetails: users });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

UserRouter.post("/add-user", async (req, res) => {
  try {
    const newData = req.body;
    const users = await UserModel.create(newData);
    res.status(201).json({ msg: "User added", userDetails: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

UserRouter.post("/add-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const newProfile = { ...req.body, user: userId };
    const users = await ProfileModel.create(newProfile);
    await ProfileModel.findByIdAndUpdate(userId, { profile: newProfile._id });
    res.status(200).json({ msg: "profile added", profile: newProfile });
  } catch (error) {
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

module.exports = UserRouter;
