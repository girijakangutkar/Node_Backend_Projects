const express = require("express");
const redis = require("./config/redisConfig");
const DataRouter = require("./routes/DataRouter");
const app = express();
require("dotenv").config();
require("./config/db");
app.use(express.json());
redis.ping().then((res) => console.log("Redis ping:", res));
// redis.set("myKey", "First data");

// redis.get("myKey").then((result) => {
//   console.log("myKey:", result);
// });

app.use("/api", DataRouter);

app.listen(3000, () => {
  console.log("Server is running on 3000 port");
});
