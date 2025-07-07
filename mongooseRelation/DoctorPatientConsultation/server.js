const express = require("express");
const mongoose = require("mongoose");
const hospitalRoutes = require("./routes/hospitalRoutes");
require("dotenv").config();
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api", hospitalRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
