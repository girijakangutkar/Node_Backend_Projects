const express = require("express");
const redis = require("../config/redis");
const BookModel = require("../model/BookModel");
const BookRouter = express.Router();
const jwt = require("jsonwebtoken");
const cron = require("node-cron");

BookRouter.get("/books", async (req, res) => {
  try {
    const token = req.headers?.authorization.split(" ")[1];
    if (!token) {
      return res.status(404).json({ msg: "Token is missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    // req.userId = decoded.userId;
    const cached = await redis.get(userId);
    console.log("Redis cached data:", cached);

    if (cached) {
      return res
        .status(200)
        .json({ msg: "Data fetched from cache", cached: JSON.parse(cached) });
    }
    const DbData = await BookModel.find({ userId });
    await redis.set(userId, JSON.stringify(DbData), "EX", 60);

    res.status(200).json({ msg: "Data from DB", data: DbData });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
});

BookRouter.post("/books", async (req, res) => {
  try {
    const token = req.headers?.authorization.split(" ")[1];
    if (!token) {
      return res.status(404).json({ msg: "Token is missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.userId = decoded.userId;
    const newBook = { ...req.body, userId: decoded.userId };
    const bookList = await BookModel.create(newBook);

    await redis.del(decoded.userId);

    res.status(200).json({ msg: "Book added", bookList });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
});

BookRouter.put("/books/:id", async (req, res) => {
  try {
    const token = req.headers?.authorization.split(" ")[1];
    if (!token) {
      return res.status(404).json({ msg: "Token is missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const bookId = req.params.id;
    const findBook = await BookModel.findOne({
      _id: bookId,
      userId: decoded.userId,
    });

    if (!findBook) {
      return res.status(404).json({ msg: "Book does not exists" });
    }
    await redis.del(decoded.userId);
    const updateData = req.body;
    const updatedBook = await BookModel.findByIdAndUpdate(bookId, updateData, {
      new: true,
    });
    res
      .status(200)
      .json({ msg: "Book data updated successfully.", updatedBook });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
});

BookRouter.delete("/books/:id", async (req, res) => {
  try {
    const token = req.headers?.authorization.split(" ")[1];
    if (!token) {
      return res.status(404).json({ msg: "Token is missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const bookId = req.params.id;
    const findBook = await BookModel.findOne({
      _id: bookId,
      userId: decoded.userId,
    });
    if (!findBook) {
      return res.status(404).json({ msg: "Book does not exists" });
    }
    if (decoded.userId) {
      await BookModel.findByIdAndDelete(bookId);
      res.status(200).json({ msg: "Book deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
});

BookRouter.post("/books/bulk", async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Token is missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const books = req.body.books;

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ msg: "Books array is required" });
    }

    await redis.set(`bulkBooks:${userId}`, JSON.stringify(books));

    res.status(202).json({ msg: "Books will be added later via cron job" });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
});

cron.schedule("*/2 * * * *", async () => {
  console.log("Cron job running for bulk book insertion...");

  try {
    const keys = await redis.keys("bulkBooks:*");

    for (const key of keys) {
      const raw = await redis.get(key);
      const userId = key.split(":")[1];
      const books = JSON.parse(raw);

      const booksWithUserId = books.map((book) => ({
        ...book,
        userId,
      }));

      await BookModel.insertMany(booksWithUserId);
      await redis.del(key);
      console.log(`Inserted books for user ${userId}`);
    }
  } catch (err) {
    console.error("Cron job error:", err.message);
  }
});

module.exports = BookRouter;
