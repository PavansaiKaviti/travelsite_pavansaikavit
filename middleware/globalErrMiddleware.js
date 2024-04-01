const globalErrMiddleware = (err, req, res, next) => {
  const message = err.message;
  const stack = err.stack;
  const status = err.status ? err.status : "failed";
  const statusCode = err.statusCode ? err.statusCode : 500;
  console.log(err);
  res.status(statusCode).json({
    status,
    message,
    // stack,
  });
};
module.exports = globalErrMiddleware;
