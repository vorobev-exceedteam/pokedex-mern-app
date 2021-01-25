const Joi = require('joi')

const updatePasswordSchema = Joi.object({
  refreshJWT: Joi.string().required(),
  oldPassword: Joi.string().max(64).min(4).label('Old Password'),
  password: Joi.string().max(64).min(4).required().label('Password')
})

module.exports = updatePasswordSchema;
