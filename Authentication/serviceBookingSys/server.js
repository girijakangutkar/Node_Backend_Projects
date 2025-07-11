const express = require("express");
const UserRouter = require("./routes/UserRouter");
const ServiceRouter = require("./routes/ServiceRouter");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/api", UserRouter);

app.use("/app", ServiceRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
