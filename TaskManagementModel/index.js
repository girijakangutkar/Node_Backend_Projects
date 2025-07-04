const express = require("express");
const app = express();
const router = require("./routes/task.route");
require("./configs/task.config");

app.use(express.json());

app.use("/tasks", router);

app.listen(3000, () => {
  console.log("Server is running!");
});
