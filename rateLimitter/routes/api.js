const express = require("express");

const router = express.Router();
const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res
      .status(options.statusCode)
      .json({ error: "Too many requests, Please try again later." });
  },
});

router.get("/public", (req, res) => {
  res.status(200).json({ msg: "This is a public point." });
});

router.get("/limited", limiter, (req, res) => {
  res.status(200).json({ msg: "You have access to this limited endpoint!" });
});

module.exports = router;
