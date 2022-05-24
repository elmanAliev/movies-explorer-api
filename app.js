const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, errors, Joi } = require('celebrate');
require('dotenv').config();
const NotFoundErr = require('./errors/NotFoundErr');
const handleError = require('./middlewares/handleError');
const {
  createUser,
  login,
} = require('./controllers/user');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// импорт роутеров
const userRouter = require('./routes/user');
const cardRouter = require('./routes/movie');

const { PORT = 3000 } = process.env;
const app = express();

// для собирания JSON-формата
app.use(bodyParser.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

// подключаем логгер запросов
app.use(requestLogger);

// const allowedCors = [
//   'http://localhost:3000',
//   'http://localhost:3001',
//   'http://elman3605.students.nomoredomains.work',
//   'https://elman3605.students.nomoredomains.work',
// ];

// app.use((req, res, next) => {
//   const { origin } = req.headers;

//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Credentials', true);
//   }

//   const { method } = req;
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
//   const requestHeaders = req.headers['access-control-request-headers'];

//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     return res.end();
//   }

//   return next();
// });

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// запуск роутеров
// роуты, не требующие авторизации,
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', userRouter);
app.use('/movies', cardRouter);

app.use((req, res, next) => {
  next(new NotFoundErr('Запрашиемая страница не найдена'));
});

// подключаем логгер ошибок
app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT);
