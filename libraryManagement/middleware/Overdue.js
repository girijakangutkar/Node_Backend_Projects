const LibModel = require("../models/libModels");

const calculateOverdueFees = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid book ID format" });
    }

    const book = await LibModel.findById(id);

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    if (!book.borrowerName || !book.dueDate) {
      return res.status(400).json({
        error: "Book is not currently borrowed and cannot be returned.",
      });
    }

    const today = new Date();
    const dueDate = new Date(book.dueDate);

    let overdueFees = 0;
    if (today > dueDate) {
      const diffTime = today - dueDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      overdueFees = diffDays * 10;
    }

    req.overdueFees = overdueFees;
    req.bookData = book;
    next();
  } catch (error) {
    console.error("Fee calculation error:", error);
    res.status(500).json({ error: "Error calculating overdue fees" });
  }
};

module.exports = calculateOverdueFees;
