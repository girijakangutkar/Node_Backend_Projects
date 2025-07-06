const express = require("express");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/Routes");
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

app.use("/api", apiRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
