const express = require("express");
const UserRouter = require("./routes/UserRouter");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/api", UserRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
