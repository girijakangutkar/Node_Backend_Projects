const mongoose = require("mongoose");

mongoose
  .connect(process.env.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("DB is running");
  })
  .catch((err) => {
    console.log("Cannot connect to the DB");
  });

module.exports = mongoose;
