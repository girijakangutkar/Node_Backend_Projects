const express = require("express");
const adminRouter = require("./routes/book.admin.router");
const readerRouter = require("./routes/book.reader.route");
const logger = require("./middleware/book.middleware");

const app = express();

app.use(express.json());

app.use(logger);

app.use("/booksys/admin", adminRouter);
app.use("/booksys/reader", readerRouter);

app.listen(3000, () => {
  console.log("server is running!");
});
