const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
require('dotenv').config();
const NotFoundErr = require('./errors/NotFoundErr');
const handleError = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_DB, PORT } = require('./config');
const routes = require('./routes/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_DB);

// подключаем логгер запросов
app.use(requestLogger);

const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://movies.elman3605.nomoredomains.xyz',
  'https://movies.elman3605.nomoredomains.xyz',
];

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

app.use(routes);

app.use((req, res, next) => {
  next(new NotFoundErr('Запрашиемая страница не найдена'));
});

// подключаем логгер ошибок
app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT);
