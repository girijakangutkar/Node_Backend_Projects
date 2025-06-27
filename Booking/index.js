const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

//Retrieve all books
app.get("/books", (req, res) => {
  let allBooks = fs.readFileSync("./db.json", "utf-8");
  res.status(200).json(allBooks);
});

//Add a new book
app.post("/books", (req, res) => {
  let newBook = req.body;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let bookList = data.Books;
  let id = bookList[bookList.length - 1].id + 1;
  newBook = { id, ...newBook };
  bookList.push(newBook);
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(200).json({ mag: "Success", newBook });
});

//Retrieve book by id
app.get("/books/:id", (req, res) => {
  let id = req.params.id;
  const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  const menuList = data.Books;
  const bookIndex = menuList.find((items) => items.id == id);

  if (!bookIndex) {
    res.status(404).json({ msg: "Not found" });
  } else {
    res.status(200).json({ msg: "Success", bookDetails: bookIndex });
  }
});

//Retrieve by query
app.get("/searchBook", (req, res) => {
  let bookQuery =
    (req.query.author && req.query.author.toLowerCase()) ||
    (req.query.title && req.query.title.toLowerCase());

  const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  const bookList = data.Books;
  if (!bookQuery) {
    return res.status(400).json({ msg: "Please provide data" });
  }

  const matched = bookList.filter(
    (ele) =>
      (ele.title && ele.title.toLowerCase().includes(bookQuery)) ||
      (ele.author && ele.author.toLowerCase().includes(bookQuery))
  );

  if (matched.length == 0) {
    res.status(404).json({ msg: "Book is not available" });
  } else {
    res.status(200).json({ msg: "Success", bookDetails: matched });
  }
});

//Update book
app.put("/books/:id", (req, res) => {
  let id = req.params.id;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let bookList = data.Books;
  let index = bookList.findIndex((items) => items.id == id);
  if (index == -1) {
    res.status(404).json({ msg: "Not found" });
  } else {
    bookList[index] = { ...bookList[index], ...req.body };
    data.Books = bookList;
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
    res.status(200).json({ msg: "Success", bookDetails: bookList[index] });
  }
});

//Delete book
app.delete("/books/:id", (req, res) => {
  let id = req.params.id;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let bookList = data.Books;
  let index = bookList.findIndex((item) => item.id == id);

  if (index == -1) {
    res.status(404).json({ msg: "Not found" });
  }
  bookList.splice(index, 1);
  fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
  res.status(200).send({ msg: "Success" });
});

//unhandled routes
app.get((req, res) => {
  res.status(404).send("Not found");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
