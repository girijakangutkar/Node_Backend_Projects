const express = require("express");
const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const saltRounds = 10;

const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let existedUser = await UserModel.findOne({ email });
    if (existedUser) {
      return res.status(200).json({ msg: "User already exists, please login" });
    }
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      try {
        if (err) {
          return res.status(404).json({ msg: "Something is not working" });
        } else {
          let newUser = await UserModel.create({ name, email, password: hash });
          res.status(201).json({ msg: "User signup success.", newUser });
        }
      } catch (error) {
        res.status(404).json({ msg: "Not working properly" });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User dose not exists" });
    }
    let hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      try {
        if (err) {
          return res.status(404).json({ msg: "Password does not match" });
        }
        if (!result) {
          return res.status(401).json({ msg: "Invalid credentials" });
        }

        if (result) {
          let accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
          );
          let refreshToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          res.status(200).json({
            msg: "Login success",
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        }
      } catch (error) {
        res.status(404).json({ msg: "Not working properly" });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

UserRouter.get("/protected", authMiddleware(["user", "admin"]), (req, res) => {
  res.status(200).json({ msg: "Access granted", userId: req.user });
});

UserRouter.post("/refresh", async (req, res) => {
  const refreshHeader = req.headers["refresh-token"];
  const refreshToken = refreshHeader?.split(" ")[1];

  if (!refreshToken) {
    return res.status(401).json({ msg: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res
      .status(200)
      .json({ msg: "Token refreshed", accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ msg: "Invalid refresh token" });
  }
});

module.exports = UserRouter;
