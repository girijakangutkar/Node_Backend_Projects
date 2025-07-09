const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Missing or malformed token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "shhhhh");

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;
