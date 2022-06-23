const Movie = require('../models/movie');
const {
  NotFoundErr,
  BadRequestError,
  NotRulesErr,
  ExistError,
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

  try {
    const data = await Movie.find({ movieId });

    if (data.length > 0) {
      throw new ExistError(`Фильм с данным movieId уже существует: ${movieId}`);
    }

    const movie = await Movie.create({
      movieId,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      owner: req.user._id,
    });

    res.status(201).send({ data: movie });
  } catch (err) {
    if (err.name.includes('ValidationError')) {
      const errMessage = Object.values(err.errors).map((errItem) => errItem.message).join(', ');
      next(new BadRequestError(errMessage.trim()));
    } else {
      next(err);
    }
  }
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
