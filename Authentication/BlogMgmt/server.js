const express = require("express");
const UserRouter = require("./routes/UserRouter");
const BlogRouter = require("./routes/BlogRouter");
const AnalyticsRoute = require("./routes/AnalyticRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/api", UserRouter);

app.use("/app", authMiddleware, BlogRouter);

app.use("/summary", AnalyticsRoute);

app.listen(3000, () => {
  console.log("Server is running");
});
