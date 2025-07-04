const ValidateBook = (req, res, next) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "Title and author is required" });
  }
  next();
};

module.exports = ValidateBook;
