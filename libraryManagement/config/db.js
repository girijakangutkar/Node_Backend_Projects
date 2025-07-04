const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.log("Something went wrong!");
  });

module.exports = mongoose;
