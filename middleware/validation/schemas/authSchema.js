const Joi = require('joi');

const authSchema = Joi.object({
  email: Joi.string().max(254).email().required().label('Email'),
  password: Joi.string().max(64).min(4).required().label('Password')
});

module.exports = authSchema;
