class ServerError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

function errorHandler(err, res) {
  console.log(err);
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message
  });
}
module.exports = { ServerError, errorHandler };
