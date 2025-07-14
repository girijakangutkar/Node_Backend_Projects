const express = require("express");
const UserRouter = require("./routes/UserRouter");
const DishRouter = require("./routes/DishRouter");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/api", UserRouter);

app.use("/app", DishRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
