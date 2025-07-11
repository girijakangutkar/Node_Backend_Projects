const express = require("express");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");
const saltRounds = 10;

const UserRouter = express.Router();

UserRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let existedUser = await UserModel.findOne({ email });
    if (existedUser) {
      return res.status(200).json({ msg: "User already exists, please login" });
    }
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        res.status(404).json({ msg: "Unable to process further" });
      } else {
        let newUser = await UserModel.create({
          name,
          email,
          role,
          password: hash,
        });
        res.status(201).json({ msg: "User signup success", newUser });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User does not exits" });
    }
    let hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        res.status(404).json({ msg: "Password does not match" });
      }
      if (!result) {
        return res.status(401).json({ msg: "Invalid credentials" });
      }

      if (result) {
        let accessToken = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "15min" }
        );
        let refreshToken = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        res
          .status(200)
          .json({ msg: "Login success", accessToken, refreshToken });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

UserRouter.post("/logout", async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Token missing" });

  try {
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    await BlacklistedToken.create({ token, expiresAt });
    res.status(200).json({ msg: "Logged out and token blacklisted" });
  } catch (err) {
    res.status(500).json({ msg: "Logout failed" });
  }
});

UserRouter.post("/refresh", async (req, res) => {
  const refreshToken = req.headers["refresh-token"]?.split(" ")[1];
  if (!refreshToken)
    return res.status(401).json({ msg: "Refresh token missing" });

  const isBlacklisted = await BlacklistedToken.findOne({ token: refreshToken });
  if (isBlacklisted)
    return res.status(403).json({ msg: "Refresh token is blacklisted" });

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
