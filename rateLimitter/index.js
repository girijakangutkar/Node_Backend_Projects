const express = require("express");
const router = require("./routes/api");
const app = express();

app.use("/api", router);

app.get((req, res) => {
  res.status(404).json({ error: "Not found!" });
});

app.listen(3000, () => {
  console.log("Server is running...");
});
