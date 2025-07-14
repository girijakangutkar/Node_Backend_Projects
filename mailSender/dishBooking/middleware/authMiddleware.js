const jwt = require("jsonwebtoken");

const authMiddleware = (role) => {
  return (req, res, next) => {
    try {
      const token = req.headers?.authorization.split(" ")[1];
      if (!token) {
        return res.status(404).json({ msg: "Token is missing" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.userId;
      req.role = decoded.role;

      if (!role.includes(decoded.role)) {
        return res.status(403).json({ msg: "Permission declined" });
      }
      next();
    } catch (error) {
      res
        .status(500)
        .json({ msg: "Something went wrong", error: error.message });
    }
  };
};

module.exports = authMiddleware;
