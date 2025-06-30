const fs = require("fs");
const path = require("path");

const rolesPath = path.join(__dirname, "../roles.json");

function authEmployee(action) {
  return (req, res, next) => {
    let roles = JSON.parse(fs.readFileSync(rolesPath, "utf-8"));
    let userRole = req.user.role;

    if (roles[userRole] && roles[userRole].includes(action)) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  };
}

module.exports = { authEmployee };
