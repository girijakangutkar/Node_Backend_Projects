const express = require("express");
const libRouter = require("./routes/libRouter.js");
const app = express();
require("dotenv").config();
require("./config/db.js");

app.use(express.json());

app.use("/lib", libRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
