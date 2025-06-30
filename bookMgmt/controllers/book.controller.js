const { readFile, writeFile } = require("../models/book.model");

// Get all books
const getAllBooks = (req, res) => {
  const allBooks = readFile();
  if (allBooks.length > 0) {
    res.status(200).json({ msg: "Success", bookDetails: allBooks });
  } else {
    res.status(404).json({ error: "Empty list" });
  }
};

// Add a new book
const addNewBook = (req, res) => {
  const newBook = req.body;
  const list = readFile();
  const id = list.length > 0 ? list[list.length - 1].id + 1 : 1;
  const bookWithId = { id, status: "available", ...newBook };
  list.push(bookWithId);
  writeFile(list);
  res.status(201).json({ msg: "Book added", bookDetails: bookWithId });
};

// Update book details
const updateBook = (req, res) => {
  const id = parseInt(req.params.id);
  const list = readFile();
  const index = list.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: "This book does not exist" });
  } else {
    list[index] = { ...list[index], ...req.body };
    writeFile(list);
    res.status(200).json({ msg: "Book updated", bookDetails: list[index] });
  }
};

// Remove a book
const removeBook = (req, res) => {
  const id = parseInt(req.params.id);
  const list = readFile();
  const index = list.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: "This book does not exist" });
  } else {
    const removed = list.splice(index, 1);
    writeFile(list);
    res.status(200).json({ msg: "Book removed", bookDetails: removed[0] });
  }
};

// Get only available books
const getAvailableBooks = (req, res) => {
  const allBooks = readFile();
  const availableBooks = allBooks.filter((item) => item.status === "available");

  if (availableBooks.length > 0) {
    res
      .status(200)
      .json({ msg: "Available books", bookDetails: availableBooks });
  } else {
    res.status(404).json({ error: "No books available" });
  }
};

// Borrow a book
const borrowBook = (req, res) => {
  const id = parseInt(req.params.id);
  const borrower = req.body.borrowedBy;
  const list = readFile();
  const index = list.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  if (list[index].status !== "available") {
    return res.status(400).json({ error: "Book is already borrowed" });
  }

  list[index] = {
    ...list[index],
    status: "borrowed",
    borrowedBy: borrower,
    borrowedDate: new Date().toISOString(),
  };

  writeFile(list);
  console.log(
    `${list[index].borrowedDate} ${list[index].borrowedBy} borrowed: ${list[index].title} `
  );
  res.status(200).json({ msg: "Book borrowed", bookDetails: list[index] });
};

// Return a book
const returnBook = (req, res) => {
  const id = parseInt(req.params.id);
  const list = readFile();
  const index = list.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  if (list[index].status == "available") {
    return res.status(400).json({ error: "Book is already borrowed" });
  }

  console.log(
    `${new Date().toISOString()} ${list[index].borrowedBy} returned: ${
      list[index].title
    } `
  );

  const borrowedDate = new Date(list[index].borrowedDate);
  const now = new Date();
  const diffInDays = (now - borrowedDate) / (1000 * 60 * 60 * 24);

  if (diffInDays < 3) {
    return res
      .status(400)
      .json({ error: "Book cannot be returned within 3 days of borrowing." });
  }

  list[index] = {
    ...list[index],
    status: "available",
    borrowedBy: null,
    borrowedDate: null,
  };

  writeFile(list);
  res.status(200).json({ msg: "Book returned", bookDetails: list[index] });
};

module.exports = {
  getAllBooks,
  addNewBook,
  updateBook,
  removeBook,
  getAvailableBooks,
  borrowBook,
  returnBook,
};
