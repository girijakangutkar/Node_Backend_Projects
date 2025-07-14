const mongoose = require("mongoose");

mongoose
  .connect(process.env.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("Connected to the DB");
  })
  .catch((err) => {
    console.log("Cannot connect to the DB");
  });
