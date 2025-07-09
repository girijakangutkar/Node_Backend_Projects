const express = require("express");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const saltRounds = 10;

UserRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        res.status(401).json({ msg: "Error while signup" });
      } else {
        await UserModel.create({ name, email, password: hash });
        res
          .status(201)
          .json({ msg: "User signup completed, now please login" });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    let hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        res.status(404).json({ msg: "Something is not right with user" });
      }
      if (result) {
        let token = jwt.sign({ userId: user._id }, "shhhhh");
        res.status(200).json({ msg: "Login Success", token });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = UserRouter;
