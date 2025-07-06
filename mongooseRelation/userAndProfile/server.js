const express = require("express");
const UserRouter = require("./routes/UserRoutes");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/users", UserRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
