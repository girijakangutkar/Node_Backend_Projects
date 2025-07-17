const jwt = require("jsonwebtoken");

const authMiddleware = (role) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Missing or malformed token" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, "shhhhh");

      console.log("Decoded token:", decoded);
      console.log("Required roles:", role);
      console.log("User role:", decoded.role);

      if (role.includes(decoded.role)) {
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
      } else {
        return res.status(403).json({ msg: "Permission denied" });
      }
    } catch (error) {
      console.log("Auth error:", error.message);
      return res.status(401).json({ msg: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
