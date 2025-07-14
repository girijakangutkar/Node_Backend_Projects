const express = require("express");
const DataModel = require("../models/DataModel");
const redis = require("../config/redisConfig");

const DataRouter = express.Router();

DataRouter.get("/items", async (req, res) => {
  try {
    const cached = await redis.get("itemsList");

    if (cached) {
      return res
        .status(200)
        .json({ msg: "Data from cache", data: JSON.parse(cached) });
    }

    const dbData = await DataModel.find({});
    await redis.set("itemsList", JSON.stringify(dbData), "EX", 60);
    return res.status(200).json({ msg: "Data from DataBase", dbData });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error });
  }
});

DataRouter.post("/items", async (req, res) => {
  try {
    const newData = req.body;
    const addData = await DataModel.create(newData);

    await redis.del("itemsList");

    res.status(200).json({ msg: "Success", addData });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error });
  }
});

module.exports = DataRouter;
