const express = require("express");
const movieModel = require("../models/MovieModel");
const bookingModel = require("../models/BookingModel");
const UserModel = require("../models/UserModel");
const MovieRouter = express.Router();

MovieRouter.post("/movies", async (req, res) => {
  try {
    const data = req.body;
    const addData = await movieModel.create(data);
    res.status(201).json({ msg: "Added data", addData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

MovieRouter.post("/users", async (req, res) => {
  try {
    const data = req.body;
    const addData = await UserModel.create(data);
    res.status(201).json({ msg: "Added data", addData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

MovieRouter.post("/bookings", async (req, res) => {
  try {
    const data = req.body;
    const addData = await bookingModel.create(data);
    res.status(201).json({ msg: "Added data", addData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = MovieRouter;
