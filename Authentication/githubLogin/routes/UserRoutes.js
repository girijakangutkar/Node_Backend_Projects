const express = require("express");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const saltRounds = 10;
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/api/auth/github/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let users = await UserModel.findOne({ profileId: profile.id });
        if (!users) {
          users = await UserModel.create({ profileId: profile.id });
        }
        return done(null, users);
      } catch (error) {
        return done(error);
      }
    }
  )
);

UserRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

UserRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  async function (req, res) {
    const githubUserId = req.user.profileId;
    let user = await UserModel.findOne({
      profileId: githubUserId,
    });
    if (user.length == 0) {
      let newUser = await UserModel.create({
        profileId: githubUserId,
      });
      let token = jwt.sign({ userId: newUser._id }, "shhhhh", {
        expiresIn: 20,
      });
      res.status(201).json({ msg: "Github User added", newUser, token });
    } else {
      let token = jwt.sign({ userId: user._id }, "shhhhh", { expiresIn: 20 });
      res.status(201).json({ msg: "User already exists", token });
    }
  }
);

UserRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      res.status(403).json({ msg: "User already exists, please login." });
    }
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        return res
          .status(403)
          .json({ msg: "Password is not hashed correctly." });
      } else {
        const newUser = await UserModel.create({ name, email, password: hash });
        res.status(200).json({ msg: "User signin success", newUser });
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
    let findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    let hash = findUser.password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        res.status(404).json({ msg: "Password verification failed" });
      }
      if (result) {
        let token = jwt.sign({ userId: findUser._id }, "shhhhh", {
          expiresIn: 20,
        });
        res.status(200).json({ msg: "Success", token });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: " Something went wrong" });
  }
});

module.exports = UserRouter;
