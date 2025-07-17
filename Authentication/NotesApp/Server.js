const express = require("express");
const UserRouter = require("./routes/UserRoutes");
const NotesRouter = require("./routes/NoteRoutes");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use(cors());

app.use("/api", UserRouter);

app.use("/app", NotesRouter);

app.listen(3000, () => {
  console.log("Server is running on 3000 port");
});
