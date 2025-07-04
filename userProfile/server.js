const express = require("express");
const app = express();
const userRouter = require("./routes/UserRoutes");
require("./configs/db");
require("dotenv").config();

app.use(express.json());

app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("Server is running...");
});
