const { jwt } = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decode = jwt.verify(token, "shhhhh");
      req.userId = decode.userId;
      res.status(200).json({ msg: "Inside Middleware" });
      next();
    }
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

module.exports = authMiddleware;
