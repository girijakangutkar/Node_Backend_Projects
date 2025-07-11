const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 min
  limit: 3,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Too many requests",
      message: "Please wait 15 minutes before trying again.",
    });
  },
});

module.exports = limiter;
