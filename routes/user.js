const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, updateUser } = require('../controllers/user');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi
      .string()
      .required()
      .email()
      .messages({
        'string.empty': '"Email" не должен быть пустым',
        'any.required': '"Email" - обязательное поле',
      }),
    name: Joi
      .string()
      .min(2)
      .max(30)
      .required()
      .messages({
        'string.empty': '"Имя" не должно быть пустым',
        'string.min': '"Имя" должно быть не короче 2 символов',
        'string.max': '"Имя" должно быть не длиннее 30 символов',
        'any.required': '"Имя" - обязательное поле',
      }),
  }),
}), updateUser);

module.exports = router;
