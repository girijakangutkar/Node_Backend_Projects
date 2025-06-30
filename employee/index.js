const express = require("express");
const router = require("./routes/employee.route");
const logger = require("./middleware/logger.middleware");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = { role: req.headers["x-role"] || "hr" };
  next();
});

app.use(logger);

app.use("/mgmt", router);

app.use((req, res) => {
  res.send("Invalid path!");
});

app.listen(3000, () => {
  console.log("Server is running");
});
