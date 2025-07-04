const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("Something went wrong", err);
  });

module.exports = mongoose;
