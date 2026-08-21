function errorHandler(error, req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Internal server error';

  if (!error.isOperational) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
