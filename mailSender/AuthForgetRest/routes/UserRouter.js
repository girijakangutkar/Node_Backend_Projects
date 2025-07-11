const express = require("express");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const UserRouter = express.Router();
require("dotenv").config();
const limiter = require("../middleware/rateLimiter");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

UserRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(401).json({ msg: "User already exists" });
    } else {
      bcrypt.hash(password, saltRounds, async function (err, hash) {
        if (err) {
          res.status(401).json({ msg: "Error while signing in" });
        }
        const newUser = await UserModel.create({
          name,
          email,
          password: hash,
        });
        res.status(201).json({ msg: "User signup success", newUser });
      });
    }
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User does not exists" });
    }
    let hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        return res.status(401).json({ msg: "Error while login" });
      }
      if (result) {
        let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ msg: "login success", token: token });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

UserRouter.post("/forgot-password", limiter, async (req, res) => {
  try {
    let { email } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "User dose not exists, please signup" });
    } else {
      let resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "20min",
      });
      let resetPasswordLink = `http://localhost:3000/api/reset-password?token=${resetToken}`;

      await transporter.sendMail({
        from: "AuthApp",
        to: user.email,
        subject: "Password Reset Link",
        html: `<p>Dear ${user.name}, here is the password reset</p><h4>${resetPasswordLink}</h4>`,
      });
    }
    res.status(200).json({ msg: "Password reset link sent to email" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

UserRouter.post("/reset-password", async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        let user = await UserModel.findById(decoded.userId);
        bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
          if (err) {
            res.status(500).json({ msg: "Something went wrong" });
          } else {
            user.password = hash;
            await user.save();
            res.status(201).json({ msg: "Password updated" });
          }
        });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: "Something went wrong" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = UserRouter;
