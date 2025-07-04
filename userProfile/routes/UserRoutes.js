const express = require("express");
const UserModel = require("../models/UserModel");
const validateUser = require("../middleware/validate");

const userRouter = express.Router();

//Retrieve all users or by query
userRouter.get("/get-users", async (req, res) => {
  try {
    const { profile } = req.query;
    let query = {};

    if (profile) {
      query = {
        profiles: {
          $elemMatch: { profileName: { $regex: profile, $options: "i" } },
        },
      };
    }

    const users = await UserModel.find(query);
    if (users.length == 0) {
      return res.status(400).json({ msg: "List is empty" });
    }
    res.status(200).json({ msg: "Success", users });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Add users
userRouter.post("/add-user", validateUser, async (req, res) => {
  try {
    const newUser = req.body;
    if (newUser.password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be more that 6 length" });
    }
    if (newUser.name.length == 0) {
      return res.status(400).json({ error: "Name is required" });
    }
    const users = await UserModel.create(newUser);
    res.status(201).json({ msg: "success", users });
  } catch (error) {
    if (error.name == "ValidationError") {
      const msg = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: msg.join(", ") });
    }
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

userRouter.post("/add-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;
    const findUser = await UserModel.findByIdAndUpdate(userId, {
      $set: { profiles: data },
    });
    res.status(200).json({ msg: "Successfully added" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

userRouter.get("/search", async (req, res) => {
  try {
    const { name, profile } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (profile) query.profile = { $regex: profile, $options: "i" };

    const users = await UserModel.find(query);

    if (users.length == 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "Success", users });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

userRouter.put("/update-profile/:userId/:profileName", async (req, res) => {
  try {
    const newData = req.body;
    const { userId } = req.params;
    const users = await UserModel.findByIdAndUpdate(userId, {
      $set: { profiles: newData },
    });
    res.status(200).json({ msg: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

userRouter.delete("/delete-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await UserModel.findByIdAndDelete(userId);
    res.status(200).json({ msg: "success" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = userRouter;
