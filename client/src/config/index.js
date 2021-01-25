const pokeballUrl = 'http://www.pngall.com/wp-content/uploads/4/Pokeball-PNG-Download-Image.png'
const config = {
  googleSrc: 'api/auth/google',
  googleMsgSrc: 'googleAuth',
  snackbarDuration: 5000,
  pokeballUrl,
  initPokemon: {
    name: 'N/A',
    id: 1,
    height: 'N/A',
    weight: 'N/A',
    baseExp: 'N/A',
    image: pokeballUrl,
    stats: {
      ATK: 'N/A',
      HP: 'N/A',
      SpATK: 'N/A',
      DEF: 'N/A',
      SpDEF: 'N/A',
      SPD: 'N/A'
    },
    types: [],
    species: {
      name: 'N/A',
      desc: ''
    },
    abilities: [],
    weaknesses: []
  },
  initUser: {
    email: '',
    favoritePokemons: new Set([]),
    hasPassword: false
  },
  pokemonLimits: [10, 20, 50],
  pokemonTypes: [
    'normal',
    'fighting',
    'flying',
    'poison',
    'ground',
    'rock',
    'bug',
    'ghost',
    'steel',
    'fire',
    'water',
    'grass',
    'electric',
    'psychic',
    'ice',
    'dragon',
    'dark',
    'fairy',
  ],
  maxPokemons: 897
};

export default config;
