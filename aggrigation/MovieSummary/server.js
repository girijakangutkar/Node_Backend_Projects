const express = require("express");
const MovieRouter = require("./routes/movies.router");
const AnalyticRoutes = require("./routes/analyticRoutes");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/api", MovieRouter);

app.use("/app", AnalyticRoutes);

app.listen(3000, () => {
  console.log("Server is running");
});
