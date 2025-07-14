const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  name: String,
});

const DataModel = mongoose.model("data", DataSchema);

module.exports = DataModel;
