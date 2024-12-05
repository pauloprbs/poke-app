import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchData = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
  return response.data;
};

export const useFetchData = () => {
  return useQuery({
    queryKey: ['pokemonData'], // Array de chave única
    queryFn: fetchData,       // Função que realiza a requisição
  });
};