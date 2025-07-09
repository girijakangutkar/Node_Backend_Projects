const express = require("express");
const BlogModel = require("../models/BlogModel");
const BlogRouter = express.Router();

BlogRouter.get("/blogs", async (req, res) => {
  try {
    const foundPost = await BlogModel.find({ createdBy: req.userId });
    res.status(200).json({ msg: "Success", foundPost });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong." });
  }
});

BlogRouter.post("/blogs", async (req, res) => {
  try {
    const newUser = await BlogModel.create({
      ...req.body,
      createdBy: req.userId,
    });
    res.status(201).json({ msg: "Blog added", newUser });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

BlogRouter.put("/blogs/:id", async (req, res) => {
  try {
    const updateBlog = await BlogModel.findByIdAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.status(200).json({ msg: "Updated blog", updateBlog });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

BlogRouter.delete("/blogs/:id", async (req, res) => {
  try {
    const findBlog = await BlogModel.findByIdAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    res.status(200).json({ msg: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = BlogRouter;
