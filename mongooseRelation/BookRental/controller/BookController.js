const Book = require("../models/Book");
const User = require("../models/User");

exports.addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.rentBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book)
      return res.status(404).json({ error: "User or Book not found" });

    if (!user.rentedBooks.includes(bookId)) user.rentedBooks.push(bookId);
    if (!book.rentedBy.includes(userId)) book.rentedBy.push(userId);

    await user.save();
    await book.save();

    res.status(200).json({ message: "Book rented successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    await User.findByIdAndUpdate(userId, { $pull: { rentedBooks: bookId } });
    await Book.findByIdAndUpdate(bookId, { $pull: { rentedBy: userId } });

    res.status(200).json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookRenters = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate("rentedBy");
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book.rentedBy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await User.updateMany({}, { $pull: { rentedBooks: req.params.bookId } });

    res.status(200).json({ message: "Book deleted and user rentals updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
