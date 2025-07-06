const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const bookController = require("../controller/BookController");

// User routes
router.post("/add-user", userController.addUser);
router.get("/user-rentals/:userId", userController.getUserRentals);

// Book routes
router.post("/add-book", bookController.addBook);
router.post("/rent-book", bookController.rentBook);
router.post("/return-book", bookController.returnBook);
router.get("/book-renters/:bookId", bookController.getBookRenters);
router.put("/update-book/:bookId", bookController.updateBook);
router.delete("/delete-book/:bookId", bookController.deleteBook);

module.exports = router;
