const validateUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(404)
      .json({ error: "name, email or password cannot be empty." });
  }
  next();
};

module.exports = validateUser;
