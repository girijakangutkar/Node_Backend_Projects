const express = require("express");
const UserRouter = require("./routes/UserRoutes");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.get("/test", (req, res) => {
  res.status(200).json({ msg: "test page" });
});
app.use("/api", UserRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
