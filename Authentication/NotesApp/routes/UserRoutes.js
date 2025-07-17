const express = require("express");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../model/UserModel");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

UserRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        res.status(404).json({ msg: "Something went wrong" });
      } else {
        await UserModel.create({ name, email, password: hash, role: "user" });
        res.status(201).json({ msg: "User is created." });
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
    let user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User does not exits please signup" });
    }
    let hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        res.status(400).json({ msg: "Wrong password" });
      }
      if (result) {
        const userRole = user.role || "user";
        let token = jwt.sign({ userId: user._id, role: userRole }, "shhhhh");
        res.status(200).json({ msg: "User logged in", token: token });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});
module.exports = UserRouter;
