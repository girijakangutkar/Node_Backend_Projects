const express = require("express");
const TaskRoutes = require("./routes/task.router");

const app = express();

app.use(express.json());

app.use("/taskList", TaskRoutes);

app.get((req, res) => {
  res.send("Route is not present");
});

app.listen(3000, () => {
  console.log("Server is running!");
});
