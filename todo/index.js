const express = require("express");
const ToDoRoutes = require("./routes/Todo.router");

const app = express();

app.use(express.json());

app.use("/todoList", ToDoRoutes);

app.get((req, res) => {
  res.status(404).json({ msg: "This route does not exists" });
});

app.listen(3000, () => {
  console.log("Server is listing!");
});
