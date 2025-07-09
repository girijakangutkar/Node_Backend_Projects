const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  _id: String, // e.g., "B1"
  userId: String,
  movieId: String,
  bookingDate: { type: Date, default: new Date() },
  seats: Number,
  status: String, // "Booked", "Cancelled"
});

const bookingModel = mongoose.model("bookings", bookingSchema);

module.exports = bookingModel;
