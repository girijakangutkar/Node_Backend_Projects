const validateTask = (req, res, next) => {
  const { title, description, priority } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ error: "Incomplete Data Received" });
  }
  next();
};

module.exports = validateTask;
