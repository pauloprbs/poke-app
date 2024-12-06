import React, { useState, useEffect } from 'react';
import api from '../services/api';

type Pokemon = {
  name: string;
  sprite: string; // Caminho para a imagem
  abilities: string[]; // Lista de habilidades
  types: string[]; // Lista de tipos
};

const typeColors: { [key: string]: string } = {
  fire: '#F7A399',
  water: '#99C2F7',
  grass: '#A3E4B7',
  electric: '#F7E599',
  ground: '#F7D099',
  rock: '#D3C5B7',
  ice: '#C1E7E9',
  flying: '#C5D3F7',
  poison: '#D4A3E4',
  bug: '#B7E4A3',
  psychic: '#F7A3C5',
  ghost: '#A799F7',
  dragon: '#99A3F7',
  dark: '#777777',
  steel: '#D1D1D1',
  fairy: '#F7C1E9',
  normal: '#F7F7F7',
  fighting: '#D68A59',
};

const PokemonSearch = () => {
  const [search, setSearch] = useState(''); // Estado para o termo de busca
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]); // Resultados filtrados
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  const fetchPokemonDetails = async (url: string): Promise<Pokemon> => {
    try {
      const response = await api.get(url);
      const data = response.data;

      return {
        name: data.name,
        sprite: data.sprites.front_default,
        abilities: data.abilities.map((ability: any) => ability.ability.name),
        types: data.types.map((type: any) => type.type.name),
      };
    } catch {
      return {
        name: 'Desconhecido',
        sprite: '',
        abilities: [],
        types: [],
      };
    }
  };

  useEffect(() => {
    const fetchFilteredPokemon = async () => {
      if (!search.trim()) {
        setPokemonList([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/pokemon?limit=1500`);
        const results = response.data.results.filter((pokemon: { name: string }) =>
          pokemon.name.toLowerCase().includes(search.toLowerCase())
        );

        const detailedPokemon = await Promise.all(
          results.map((pokemon: { url: string }) => fetchPokemonDetails(pokemon.url))
        );

        setPokemonList(detailedPokemon);
      } catch (err) {
        setError('Erro ao carregar a lista de Pokémon.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredPokemon();
  }, [search]);

  const getBackgroundColor = (types: string[]): string => {
    return typeColors[types[0]] || '#FFFFFF'; // Pega a cor do primeiro tipo ou um padrão branco
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

      {/* Exibe os resultados da busca somente quando houver texto na busca */}
      {search.trim() && (
        <>
          {isLoading && <p>Carregando Pokémon...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {pokemonList.length === 0 && !isLoading && <p>Nenhum Pokémon encontrado.</p>}

          <ul className="rounded-md shadow-md p-4 max-h-96 overflow-y-auto space-y-4">
            {pokemonList.map((pokemon) => (
              <li
                key={pokemon.name}
                className="flex items-center p-4 text-lg rounded-md shadow-sm"
                style={{ backgroundColor: getBackgroundColor(pokemon.types) }}
              >
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="w-12 h-12 mr-4"
                />
                <div className="flex-1">
                  <p className="font-bold capitalize">{pokemon.name}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {pokemon.abilities.map((ability) => (
                      <span
                        key={ability}
                        className="bg-black text-white text-xs px-2 py-1 rounded-full"
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PokemonSearch;