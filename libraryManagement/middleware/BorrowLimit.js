const LibModel = require("../models/libModels");

const limitBorrowedBooks = async (req, res, next) => {
  const { borrowerName } = req.body;
  if (!borrowerName) {
    return res.status(400).json({ error: "Borrower name is required" });
  }

  const borrowedBooks = await LibModel.find({
    borrowerName,
    returnDate: null,
  });

  if (borrowedBooks.length >= 3) {
    return res
      .status(409)
      .json({ error: `${borrowerName} has already borrowed 3 books` });
  }
  next();
};

module.exports = limitBorrowedBooks;
