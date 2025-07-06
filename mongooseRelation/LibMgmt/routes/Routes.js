const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const memberController = require("../controllers/memberController");

// Book routes
router.post("/add-book", bookController.addBook);
router.post("/borrow-book", bookController.borrowBook);
router.post("/return-book", bookController.returnBook);
router.get("/book-borrowers/:bookId", bookController.getBookBorrowers);
router.put("/update-book/:bookId", bookController.updateBook);
router.delete("/delete-book/:bookId", bookController.deleteBook);

// Member routes
router.post("/add-member", memberController.addMember);
router.get(
  "/member-borrowed-books/:memberId",
  memberController.getMemberBorrowedBooks
);

module.exports = router;
