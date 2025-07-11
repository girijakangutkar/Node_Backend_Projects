const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");

const authMiddleware = (role) => {
  return async (req, res, next) => {
    try {
      const token = req.headers?.authorization?.split(" ")[1];
      //   console.log("token", token);
      if (!token) {
        return res.status(401).json({ msg: "Token missing" });
      }
      const isBlacklisted = await BlacklistedToken.findOne({ token });
      if (isBlacklisted)
        return res.status(403).json({ msg: "Token is blacklisted" });

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!role.includes(decoded.role))
          return res.status(403).json({ msg: "Access denied" });

        req.user = decoded.userId;
        req.role = decoded.role;
        next();
      } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired token" });
      }
    } catch (error) {
      console.log(error.message);
      if (error.message == "jwt expired") {
        let refreshToken = req.headers?.["refresh-token"]?.split(" ")[1];
        if (!refreshToken) {
          return res.status(401).json({ msg: "Missing refresh token" });
        }
        let refreshTokenDecode = jwt.verify(
          refreshToken,
          process.env.JWT_SECRET
        );
        if (refreshTokenDecode) {
          let newAccessToken = jwt.sign(
            { userId: refreshToken.userId, role: refreshToken.role },
            process.env.JWT_SECRET,
            { expiresIn: "15min" }
          );
          decode = jwt.verify(newAccessToken, process.env.JWT_SECRET);
          res
            .status(200)
            .json({ msg: "Token refreshed", accessToken: newAccessToken });
        } else {
          return res.status(403).json({ msg: "Invalid refresh token" });
        }
      }
    }
  };
};

module.exports = authMiddleware;
