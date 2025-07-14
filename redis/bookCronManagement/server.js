const express = require("express");
const UserRouter = require("./routes/UserRouter");
const BookRouter = require("./routes/BookRouter");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/api", UserRouter);

app.use("/app", BookRouter);

app.listen(3000, () => {
  console.log("Sever is running");
});
