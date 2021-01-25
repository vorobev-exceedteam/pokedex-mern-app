const Joi = require('joi')

const pokemonSchema = Joi.object({
  id: Joi.number().required().label('Pokemon id')
})

module.exports = pokemonSchema;
