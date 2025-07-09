const express = require("express");
const BlogModel = require("../models/BlogModel");
const AnalyticsRoute = express.Router();

AnalyticsRoute.get("/blogs/stats", async (req, res) => {
  try {
    const totalBlogs = await BlogModel.countDocuments();
    // console.log(totalBlogs);
    const blogPerUser = await BlogModel.aggregate([
      {
        $group: { _id: "$createdBy", blogCount: { $sum: 1 } },
      },
    ]);
    const commonTag = await BlogModel.aggregate([
      { $unwind: "$tags" },
      {
        $group: { _id: "$tags", countTag: { $sum: 1 } },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    res
      .status(200)
      .json({ msg: "success", totalBlogs, blogPerUser, commonTag });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = AnalyticsRoute;
