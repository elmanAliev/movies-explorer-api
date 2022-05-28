function handleError(err, req, res, next) {
  const { message, statusCode = 500 } = err;
  res
    .status(statusCode)
    .send(statusCode === 500
      ? { message: 'Что-то пошло не так' }
      : { message });

  next();
}

module.exports = handleError;
