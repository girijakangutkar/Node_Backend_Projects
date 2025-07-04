const express = require("express");
const app = express();
const userRouter = require("./Routes/userRoutes");
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
