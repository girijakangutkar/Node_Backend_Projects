const express = require("express");
const {
  getAllBooks,
  addNewBook,
  updateBook,
  removeBook,
} = require("../controllers/book.controller");
const router = express.Router();

router.get("/books", getAllBooks);

router.post("/books", addNewBook);

router.put("/books/:id", updateBook);

router.delete("/books/:id", removeBook);

module.exports = router;
