const FavoritePokemon = require('../models/FavoritePokemon');
const statusCodes = require('../utills/statusCodes');
const createResponse = require('../utills/createResponse');
const { BadRequest } = require('../utills/Errors');

exports.addToFavorite = async (req, res, next) => {
  try {
    const isPokemonAdded = await FavoritePokemon.exists({
      pokemonID: req.body.id,
      userID: req.user._id
    });
    if (isPokemonAdded) {
      return next(
        new BadRequest(
          `Pokemon by id ${req.body.id} was already added to favorites`
        )
      );
    }
    await FavoritePokemon.create({
      pokemonID: req.body.id,
      userID: req.user._id
    });
    return res
      .status(statusCodes.OK)
      .json(createResponse('ok', 'Pokemon was added to favorites'));
  } catch (e) {
    return next(e);
  }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const pokemons = await FavoritePokemon.find({ userID: req.user._id });
    return res.status(statusCodes.OK).json(
      'ok',
      'Pokemons has been sent',
      pokemons.map((pokemon) => {
        pokemon.pokemonID;
      })
    );
  } catch (e) {}
};

exports.removeFromFavorites = async (req, res, next) => {
  try {
    await FavoritePokemon.deleteOne({
      pokemonID: req.body.id,
      userID: req.user._id
    })
    res
      .status(statusCodes.OK)
      .json(createResponse('ok', 'Pokemon was removed from favorites'));
  } catch (e) {
    return next(e);
  }
};

exports.clear = async (req, res, next) => {
  try {
    await FavoritePokemon.deleteMany({ userID: req.user._id });
    res
      .status(statusCodes.OK)
      .json(createResponse('ok', 'All pokemons was removed from favorites'));
  } catch (e) {
    return next(e);
  }
};
