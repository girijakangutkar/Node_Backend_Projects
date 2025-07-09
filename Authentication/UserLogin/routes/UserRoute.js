const express = require("express");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

UserRouter.post("/signup", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "Something went wrong" });
      } else {
        await UserModel.create({ userName, email, password: hash });
        res.status(201).json({ msg: "Sign up success" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }
    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "Users not found, Please signup." });
    } else {
      let hash = user.password;
      bcrypt.compare(password, hash, function (err, result) {
        if (result) {
          var token = jwt.sign({ userId: user._id }, "shhhhh");
          res.status(200).json({ msg: "Token success", token: token });
        } else {
          res.status(400).json({ msg: "Token is invalid" });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = UserRouter;
