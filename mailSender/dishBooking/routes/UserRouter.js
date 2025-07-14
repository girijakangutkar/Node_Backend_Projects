const express = require("express");
const UserModel = require("../models/UserModel");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

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
    const findUser = await UserModel.findOne({ email });
    if (findUser) {
      return res.status(201).json({ msg: "User already existed" });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        return res
          .status(500)
          .json({ msg: "Something went wrong while hashing password" });
      }
      const newUser = await UserModel.create({ name, email, password: hash });
      res.status(200).json({ msg: "Signup success", newUser });
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
      return res.status(404).json({ msg: "User dose not exists" });
    }

    const hash = user.password;
    bcrypt.compare(password, hash, async function (err, result) {
      if (err) {
        return res.status(500).json({ msg: "Incorrect password" });
      }
      if (result) {
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: 60 }
        );
        return res.status(200).json({ msg: "Login success", token: token });
      } else {
        res.status(401).json({ msg: "Invalid password" });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
});

UserRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return res.status(403).json({ msg: "User not found" });
    } else {
      const resetToken = jwt.sign(
        { userId: findUser._id, role: findUser.role },
        process.env.JWT_SECRET,
        { expiresIn: 60 }
      );
      const resetLink = `http://localhost:3000/api/reset-password?token=${resetToken}`;
      await transporter.sendMail({
        from: "girija.kangutkar@gmail.com",
        to: findUser.email,
        subject: "Password reset link",
        html: `<p>Dear ${findUser.name}, here is your password reset link</p><b>${resetLink}<b>`,
      });
      res.status(200).json({ msg: "Password reset" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
});

UserRouter.post("/reset-password", async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      let user = await UserModel.findById(decoded.userId);
      bcrypt.hash(newPassword, 10, async function (err, hash) {
        if (err) {
          return res.status(403).json({ msg: "Cannot hash password" });
        } else {
          user.password = hash;
          await user.save();
          res.status(200).json({ msg: "User password updated" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
});

module.exports = UserRouter;
