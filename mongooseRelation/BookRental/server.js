const express = require("express");
const BookRouter = require("./routes/BookRoutes");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/lib", BookRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
