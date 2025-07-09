const mongoose = require("mongoose");

mongoose
  .connect(process.env.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Error while connection to the DB");
  });

module.exports = mongoose;
