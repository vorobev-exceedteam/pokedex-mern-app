const mongoose = require('mongoose');

const { Schema } = mongoose;

const FavoritePokemonSchema = new Schema({
  pokemonID: { type: Number, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('FavoritePokemon', FavoritePokemonSchema);
