const express = require("express");
const router = require("./routes/ticket.route");
const app = express();

app.use(express.json());

app.use("/sys", router);

app.listen(3000, () => {
  console.log("server is running");
});
