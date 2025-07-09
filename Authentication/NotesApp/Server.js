const express = require("express");
const UserRouter = require("./routes/UserRoutes");
const NotesRouter = require("./routes/NoteRoutes");
const authMiddleware = require("./middleware/auth");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/api", UserRouter);

app.use("/app", authMiddleware, NotesRouter);

app.listen(3000, () => {
  console.log("Server is running");
});
