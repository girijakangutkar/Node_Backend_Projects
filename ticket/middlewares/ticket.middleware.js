const validateTicketBody = (req, res, next) => {
  const { title, description, priority, user } = req.body;

  if (!title || !description || !priority || !user) {
    return res
      .status(404)
      .json({ error: "Data insufficient, please provide all required fields" });
  }
  next();
};

module.exports = validateTicketBody;
