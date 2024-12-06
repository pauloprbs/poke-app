import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2', // Base URL da PokéAPI
});

export default api;