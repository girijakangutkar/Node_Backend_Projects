const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("Connected to the DB");
  })
  .catch((err) => {
    console.log("SOmething went wrong with:");
  });

module.exports = mongoose;
