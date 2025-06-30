const logger = (req, res, next) => {
  let time = new Date().toISOString();
  console.log(`${time} ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = logger;
