const express = require("express");
const UserModel = require("../model/UserModel");
const UserRouter = express.Router();
const saltRounds = 10;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

UserRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existedUser = await UserModel.findOne({ email });

    if (existedUser) {
      return res.status(201).json({ msg: "User already existed" });
    }

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        res.status(500).json({ msg: "Something went wrong while signup" });
      }
      const newUser = await UserModel.create({ name, email, password: hash });
      res.status(200).json({ msg: "User signup success", newUser });
    });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        return res.status(500).json({ msg: "Something went wrong" });
      }
      if (result) {
        let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "20min",
        });
        res.status(200).json({ msg: "Login success", token: token });
      } else {
        res.status(201).json({ msg: "Password does not matches" });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
});

module.exports = UserRouter;
