const validatePriority = (req, res, next) => {
  const { priority } = req.params;
  const validPriorities = ["low", "medium", "high"];

  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      error:
        "Invalid priority. Use 'low', 'medium', or 'high' (lowercase only).",
    });
  }

  next();
};

module.exports = validatePriority;
