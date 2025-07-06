const User = require("../models/User");
const Book = require("../models/Book");

exports.addUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserRentals = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("rentedBooks");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user.rentedBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
