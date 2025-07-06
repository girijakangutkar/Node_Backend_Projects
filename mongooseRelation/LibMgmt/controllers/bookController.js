const Book = require("../models/Book");
const Member = require("../models/Member");

exports.addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.borrowBook = async (req, res) => {
  try {
    const { memberId, bookId } = req.body;
    const book = await Book.findById(bookId);
    const member = await Member.findById(memberId);

    if (!book || !member)
      return res.status(404).json({ error: "Book or Member not found" });
    if (book.status === "borrowed")
      return res.status(400).json({ error: "Book is already borrowed" });

    book.borrowers.push(memberId);
    member.borrowedBooks.push(bookId);

    await book.save();
    await member.save();

    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { memberId, bookId } = req.body;

    await Book.findByIdAndUpdate(bookId, { $pull: { borrowers: memberId } });
    await Member.findByIdAndUpdate(memberId, {
      $pull: { borrowedBooks: bookId },
    });

    const updatedBook = await Book.findById(bookId);
    if (updatedBook.borrowers.length === 0) {
      updatedBook.status = "available";
      await updatedBook.save();
    }

    res.status(200).json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookBorrowers = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate("borrowers");
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book.borrowers);
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

    await Member.updateMany(
      {},
      { $pull: { borrowedBooks: req.params.bookId } }
    );

    res
      .status(200)
      .json({ message: "Book deleted and removed from all members" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
