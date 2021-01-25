const express = require('express');

const pokemonController = require('../controllers/pokemons');
const passportAuth = require('../middleware/security/passport-auth');
const validationHandler = require("../middleware/validation/validationHandler");
const pokemonSchema = require("../middleware/validation/schemas/pokemonSchema");

const router = express.Router();

router.get(
  '/favorite',
  passportAuth('auth-jwt', { session: false }),
  pokemonController.getFavorites
);

router.post(
  '/favorite',
  validationHandler(pokemonSchema, 'addFavorite'),
  passportAuth('auth-jwt', { session: false }),
  pokemonController.addToFavorite
);

router.delete(
  '/favorite',
  validationHandler(pokemonSchema, 'deleteFavorite'),
  passportAuth('auth-jwt', { session: false }),
  pokemonController.removeFromFavorites
);

router.delete(
  '/favorite/all',
  passportAuth('auth-jwt', { session: false }),
  pokemonController.clear
);

module.exports = router;
