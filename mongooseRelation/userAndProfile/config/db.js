const mongoose = require("mongoose");

mongoose
  .connect(process.env.Mongo_URI, {
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
