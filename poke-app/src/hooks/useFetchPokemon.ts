import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

type Pokemon = {
  id: number;
  name: string;
  type: string;
};

type PokemonResponse = {
  results: {
    name: string;
    url: string;
  }[];
  next: string | null; // Para verificar se há mais Pokémon
};

// Função para buscar detalhes de um Pokémon usando sua URL
const fetchPokemonDetails = async (url: string): Promise<Pokemon> => {
  const response = await api.get(url);
  const data = response.data;

  return {
    id: data.id,
    name: data.name,
    type: data.types[0].type.name,
  };
};

// Função para buscar Pokémon com base na página e no limite
const fetchPokemon = async (page: number, limit: number): Promise<Pokemon[]> => {
  const offset = (page - 1) * limit; // Calcula o offset com base na página
  const response = await api.get<PokemonResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
  
  const pokemonUrls = response.data.results.map((pokemon) => pokemon.url);
  
  // Faz a requisição dos detalhes dos Pokémon
  const pokemonDetails = await Promise.all(pokemonUrls.map(fetchPokemonDetails));
  
  return pokemonDetails; // Retorna os detalhes dos Pokémon
};

export const useFetchPokemon = (page: number, limit: number) => {
  return useQuery<Pokemon[], Error>({
    queryKey: ['pokemon', page], // Chave única baseada na página
    queryFn: () => fetchPokemon(page, limit),
    staleTime: 5000, // Mantém o cache válido por 5 segundos
  });
};