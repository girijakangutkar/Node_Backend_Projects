const mongoose = require("mongoose");

mongoose
  .connect(process.env.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log("Something went wrong");
  });

module.exports = mongoose;
