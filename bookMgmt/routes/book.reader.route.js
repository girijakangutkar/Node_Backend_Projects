const express = require("express");
const {
  getAvailableBooks,
  borrowBook,
  returnBook,
} = require("../controllers/book.controller");
const router = express.Router();

router.get("/books", getAvailableBooks);

router.post("/borrow/:id", borrowBook);

router.post("/return/:id", returnBook);

module.exports = router;
