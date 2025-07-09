const express = require("express");
const UserRouter = require("./routes/UserRoute");
const authMiddleware = require("./middlewares/auth");

require("./config/mongodb");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/api", UserRouter);

app.get("/home", authMiddleware, (req, res) => {
  res.status(200).json({ msg: "Welcome to home page" });
});

app.listen(3000, () => {
  console.log("Server is running ");
});
