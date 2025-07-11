const jwt = require("jsonwebtoken");

const authMiddleware = (role) => {
  return (req, res, next) => {
    let token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Token missing" });
    }

    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (role.includes(decoded.role)) {
        req.user = decoded.userId;
        req.role = decoded.role;

        next();
      } else {
        return res.status(403).json({ msg: "Access denied" });
      }
    } catch (err) {
      return res.status(401).json({ msg: "Invalid or expired token" });
    }
  };
};

module.exports = authMiddleware;
