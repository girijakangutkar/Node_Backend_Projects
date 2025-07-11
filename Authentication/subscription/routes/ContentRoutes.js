const express = require("express");
const ContentModel = require("../models/ContentModel");
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const ContentRouter = express.Router();

ContentRouter.get(
  "/content/free",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      const contents = await ContentModel.find({ contentType: "Free" });
      res.status(200).json({ msg: "Success", contents });
    } catch (error) {
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

ContentRouter.post("/content", authMiddleware(["admin"]), async (req, res) => {
  try {
    const addContent = req.body;
    const newContent = await ContentModel.create(addContent);
    res.status(200).json({ msg: "Content added successfully", newContent });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

ContentRouter.delete(
  "/content/:id",
  authMiddleware(["admin"]),
  async (req, res) => {
    try {
      const contentId = req.params.id;
      await ContentModel.findByIdAndDelete(contentId);
      res.status(200).json({ msg: "Content deleted successfully" });
    } catch (error) {
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

ContentRouter.get(
  "/content/premium",
  authMiddleware(["user", "admin"]),
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.user);
      if (!["Premium", "Pro"].includes(user.goldMember)) {
        return res
          .status(403)
          .json({ msg: "Upgrade required to access premium content" });
      }

      const contents = await ContentModel.find({
        contentType: { $in: ["Premium", "Pro"] },
      });
      res.status(200).json({ msg: "Success", contents });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);

module.exports = ContentRouter;
