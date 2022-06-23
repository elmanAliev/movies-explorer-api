const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom((value, helpers) => {
      if (isUrl(value)) {
        return value;
      }
      return helpers.message('Поле image заполнено неверно');
    }).required(),
    trailerLink: Joi.string().custom((value, helpers) => {
      if (isUrl(value)) {
        return value;
      }
      return helpers.message('Поле trailerLink заполнено неверно');
    }).required(),
    thumbnail: Joi.string().custom((value, helpers) => {
      if (isUrl(value)) {
        return value;
      }
      return helpers.message('Поле thumbnail заполнено неверно');
    }).required(),
    owner: Joi.string().length(24).hex(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
