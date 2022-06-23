// function handleError(err, req, res, next) {
//   const { message, statusCode = 500 } = err;
//   res
//     .status(statusCode)
//     .send(statusCode === 500
//       ? { message: 'Что-то пошло не так' }
//       : { message });

//   next();
// }

// module.exports = handleError;

const handleError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ошибка сервера';
  res.status(statusCode).send({ message });
  next();
};

module.exports = handleError;
