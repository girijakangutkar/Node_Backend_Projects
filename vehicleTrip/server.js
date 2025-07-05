const express = require("express");
const VehicleRoutes = require("./routes/VehicleRoute");
const AnalysisRouter = require("./routes/Analysis");
const app = express();
require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/vehicle", VehicleRoutes);

app.use("/info", AnalysisRouter);

app.listen(3000, () => {
  console.log("Server is running...");
});
