const Joi = require('joi')

const refreshSchema = Joi.object({
  refreshJWT: Joi.string().required(),
})

module.exports = refreshSchema;
