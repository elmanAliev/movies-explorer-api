const Movie = require('../models/movie');
const {
  NotFoundErr,
  BadRequestError,
  NotRulesErr,
} = require('../errors');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => next(err));
};

module.exports.createMovie = async (req, res, next) => {
  const {
    movieId, country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail,
  } = req.body;

  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const id = req.params.movieId;
  Movie.findById(id)
    .then((card) => {
      if (!card) {
        next(new NotFoundErr('Фильм не найден'));
      } else if (String(card.owner) === req.user._id) {
        Movie.findByIdAndRemove(id)
          .then(() => res.status(200).send({ message: 'Фильм удален' }))
          .catch(() => next(new NotFoundErr('Фильм не найден')));
      } else {
        throw new NotRulesErr('Нет прав для удаление фильма');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
