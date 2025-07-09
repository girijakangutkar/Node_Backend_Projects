const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];
  if (token) {
    let decoded = jwt.verify(token, "shhhhh");
    console.log(decoded);
    next();
  } else {
    res.status(404).json({ msg: "Token is not authorize" });
  }
};

module.exports = authMiddleware;
