const express = require("express");
const UserRouter = require("./routes/UserRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const SubRouter = require("./routes/SubRoutes");
const ContentRouter = require("./routes/ContentRoutes");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/api", UserRouter);

app.use("/sub", authMiddleware(["user", "admin"]), SubRouter);

app.use("/app", ContentRouter);

app.get("/test", authMiddleware(["user", "admin"]), async (req, res) => {
  try {
    res.status(200).json({ msg: "Testing routes" });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("server is running");
});
