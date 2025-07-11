const express = require("express");
const MailRouter = require("./routes/MailRoutes");
const app = express();
require("dotenv").config();
// require("./config/db");

app.use(express.json());

app.use("/sendmail", MailRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
