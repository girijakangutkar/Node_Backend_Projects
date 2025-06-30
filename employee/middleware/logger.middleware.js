const logger = (req, res, next) => {
  const timeStamp = new Date().toISOString();
  console.log(
    `${timeStamp} ${req.method} ${req.originalUrl} - Role: ${
      req.user?.role || "unknown"
    }`
  );
  next();
};

module.exports = logger;
