import axios from 'axios';

export default axios.create({
  baseURL: '/pokeapi',
  responseType: 'json',
});
