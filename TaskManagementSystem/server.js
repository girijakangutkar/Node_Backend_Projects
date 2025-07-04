const express = require("express");
const taskRouter = require("./routes/task.routes");
require("./config/db");
const app = express();

app.use(express.json());

app.use("/sys", taskRouter);

app.listen(3000, () => {
  console.log("Server is running ");
});
