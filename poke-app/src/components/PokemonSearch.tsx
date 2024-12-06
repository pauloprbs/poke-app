import React, { useState, useEffect } from 'react';
import api from '../services/api';

type Pokemon = {
  name: string;
  url: string;
};

type PokemonDetails = {
  id: number;
  name: string;
  type: string;
};

const PokemonSearch = () => {
  const [search, setSearch] = useState(''); // Estado para o termo de busca
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]); // Lista inicial de Pokémon
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]); // Resultados filtrados
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null); // Pokémon selecionado
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  // Busca a lista inicial de Pokémon (apenas nomes e URLs)
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await api.get(`/pokemon?limit=1500`);
        setPokemonList(response.data.results); // Armazena a lista completa
      } catch (err) {
        setError('Erro ao carregar a lista de Pokémon.');
      }
    };

    fetchPokemonList();
  }, []);

  // Atualiza os resultados filtrados conforme o usuário digita
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredPokemon([]); // Limpa a lista se não houver busca
    } else {
      setFilteredPokemon(
        pokemonList.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, pokemonList]);

  // Função para buscar os detalhes do Pokémon selecionado
  const fetchPokemonDetails = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(url);
      const data = response.data;

      const pokemonDetails: PokemonDetails = {
        id: data.id,
        name: data.name,
        type: data.types[0].type.name,
      };

      setSelectedPokemon(pokemonDetails);
    } catch (err) {
      setError('Erro ao carregar os detalhes do Pokémon.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center text-black py-8">
      {/* Campo de busca */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Digite o nome do Pokémon..."
        className="w-full p-3 border rounded-md mb-4 shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
      />

      {/* Resultados filtrados */}
    {filteredPokemon.length > 0 && (
      <ul className="bg-gray-100 rounded-md shadow-md p-4 max-h-60 overflow-y-auto">
        {filteredPokemon.map((pokemon) => (
          <li
            key={pokemon.name}
            className="p-2 text-lg cursor-pointer hover:bg-indigo-100"
            onClick={() => fetchPokemonDetails(pokemon.url)} // Busca detalhes ao clicar
          >
            {pokemon.name}
          </li>
        ))}
      </ul>
    )}

      {/* Exibe os detalhes do Pokémon selecionado */}
      {isLoading && <p>Carregando detalhes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {selectedPokemon && (
        <div className="bg-white rounded-md shadow-md p-4 mt-4">
          <p><strong>ID:</strong> {selectedPokemon.id}</p>
          <p><strong>Nome:</strong> {selectedPokemon.name}</p>
          <p><strong>Tipo:</strong> {selectedPokemon.type}</p>
        </div>
      )}
    </div>
  );
};

export default PokemonSearch;