const express = require("express");
const LibModel = require("../models/libModels");
const ValidateBook = require("../middleware/BookValidation");
const limitBorrowedBooks = require("../middleware/BorrowLimit");
const calculateOverdueFees = require("../middleware/Overdue");
const libRouter = express.Router();

libRouter.get("/books", async (req, res) => {
  try {
    const bookList = await LibModel.find({});

    if (bookList.length == 0) {
      return res.status(404).json({ error: "Book list is empty." });
    }
    res.status(200).json({ msg: "Success", bookList });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

libRouter.post("/books", ValidateBook, async (req, res) => {
  try {
    const newBook = req.body;
    let book = await LibModel.create(newBook);
    res.status(201).json({ msg: "Success", book });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

libRouter.patch("/books/borrow/:id", limitBorrowedBooks, async (req, res) => {
  try {
    const { id } = req.params;
    const { borrowerName } = req.body;

    if (!id || !borrowerName) {
      return res.status(400).json({ error: "Missing Id or borrowerName" });
    }

    // Check if book exists first
    const existingBook = await LibModel.findById(id);
    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check if book is already borrowed
    if (existingBook.borrowerName) {
      return res.status(409).json({
        error: `Book is already borrowed by ${existingBook.borrowerName}`,
      });
    }

    const bookData = {
      $set: {
        borrowerName,
        borrowDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days due
        status: "borrowed",
        returnDate: null,
      },
    };

    const updateBook = await LibModel.findByIdAndUpdate(id, bookData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ msg: "Success", updateBook });
  } catch (error) {
    console.log("PATCH /books/borrow/:id error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

libRouter.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid book ID format" });
    }

    const borrowCheck = await LibModel.findById(id);

    if (!borrowCheck) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (borrowCheck.borrowerName) {
      return res.status(409).json({
        error: `The book you are trying to delete is borrowed by ${borrowCheck.borrowerName}`,
      });
    }

    const bookToDelete = await LibModel.findByIdAndDelete(id);
    res.status(200).json({ msg: "success", bookToDelete });
  } catch (error) {
    console.log("DELETE /books/:id error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

libRouter.patch("/books/return/:id", calculateOverdueFees, async (req, res) => {
  try {
    const { id } = req.params;
    const { overdueFees } = req;

    const updateBook = await LibModel.findByIdAndUpdate(
      id,
      {
        $set: {
          returnDate: new Date(),
          overdueFees: overdueFees,
          status: "available",
        },
        $unset: {
          borrowerName: null,
          borrowDate: null,
          dueDate: null,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updateBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({
      msg: "Book returned successfully",
      overdueFees: overdueFees,
      message:
        overdueFees > 0
          ? `Book returned with overdue fees of ₹${overdueFees}`
          : "Book returned on time",
      updateBook,
    });
  } catch (error) {
    console.error("Return error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

libRouter.get("/books/overdue", async (req, res) => {
  try {
    const today = new Date();
    const overdueBooks = await LibModel.find({
      dueDate: { $lt: today },
      borrowerName: { $exists: true, $ne: null },
    });

    res.status(200).json({
      msg: "Success",
      count: overdueBooks.length,
      overdueBooks,
    });
  } catch (error) {
    console.error("Overdue books error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = libRouter;
