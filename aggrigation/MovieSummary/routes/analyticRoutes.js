const express = require("express");
const bookingModel = require("../models/BookingModel");
const movieModel = require("../models/MovieModel");
const AnalyticRoutes = express.Router();

AnalyticRoutes.get("/analytics/movie-bookings", async (req, res) => {
  try {
    const totalBooking = await bookingModel.countDocuments();
    const watcherPerMovie = await bookingModel.aggregate([
      { $group: { _id: "$movieId", countSeat: { $sum: 1 } } },
    ]);
    res
      .status(200)
      .json({ Msg: "Success", totalBooking: totalBooking, watcherPerMovie });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

AnalyticRoutes.get("/analytics/user-bookings", async (req, res) => {
  try {
    const history = await bookingModel.aggregate([
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "history",
        },
      },
      { $unwind: "$history" },
      {
        $group: {
          _id: "$history.title",
          users: { $addToSet: "$userId" },
        },
      },
    ]);
    res.status(200).json({ msg: "Success", history });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

AnalyticRoutes.get("/analytics/top-users", async (req, res) => {
  try {
    const topUsers = await bookingModel.aggregate([
      { $group: { _id: "$userId", countBooking: { $sum: 1 } } },
      { $sort: { countUser: -1 } },
      { $limit: 3 },
    ]);
    res.status(200).json({ msg: "success", topUsers });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

AnalyticRoutes.get("/analytics/genre-wise-bookings", async (req, res) => {
  try {
    const seatPerGenre = await bookingModel.aggregate([
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "MovieData",
        },
      },
      { $unwind: "$MovieData" },
      { $unwind: "$MovieData.genre" },
      { $group: { _id: "$MovieData.genre", count: { $sum: "$seats" } } },
    ]);
    res.status(200).json({ msg: "Success", seatPerGenre });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

AnalyticRoutes.get("/analytics/active-bookings", async (req, res) => {
  try {
    const activeBooking = await bookingModel.aggregate([
      { $match: { status: "Booked" } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "UserData",
        },
      },
      { $unwind: "$UserData" },
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movieData",
        },
      },
      { $unwind: "$movieData" },
      {
        $group: {
          _id: "$_id",
          userDetails: { $first: "$UserData" },
          movieDetails: { $first: "$movieData" },
          totalBookings: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({ msg: "Success", activeBooking });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = AnalyticRoutes;
