import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

// Definição do tipo Pokemon
type Pokemon = {
  name: string;
  sprite: string;
  abilities: string[];
  types: string[];
};

// Defição das cores de fundo para cada tipo de pokemon
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

// Definição dos estados
const PokemonSearch = () => {
  const [search, setSearch] = useState(''); // Armazena o valor digitado no campo de busca
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]); // Lista de pokemons a ser exibida na interface
  const [isLoading, setIsLoading] = useState(false); // Lista sendo carregada
  const [error, setError] = useState<string | null>(null); // Armazena mensagem de erro
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Índice do pokemon selecionado (navegação com o teclado)
  const searchInputRef = useRef<HTMLInputElement>(null); // Foco programático para o campo de entrada de texto

  // Atalho para foco no input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Requisição à api para obter detalhes do pokemon
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
      return { name: 'Desconhecido', sprite: '', abilities: [], types: [] };
    }
  };

  // Filtragem e carregamento dos pokemons
  useEffect(() => {
    const fetchFilteredPokemon = async () => {
      if (!search.trim()) {
        setPokemonList([]);
        setSelectedIndex(null);
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
        setSelectedIndex(0); // Seleciona o primeiro Pokémon da lista ao carregar
      } catch {
        setError('Erro ao carregar a lista de Pokémon.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredPokemon();
  }, [search]);

  // Navegação com o teclado

  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (pokemonList.length === 0 || selectedIndex === null) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === pokemonList.length - 1 ? 0 : (prevIndex as number) + 1
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex === 0 ? pokemonList.length - 1 : (prevIndex as number) - 1
        );
      }
    };

    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [pokemonList, selectedIndex]);

  // Define a cor de fundo
  //Usa apenas o primeiro tipo do pokemon
  const getBackgroundColor = (types: string[]): string => {
    return typeColors[types[0]] || '#FFFFFF';
  };

  // Interface
  return (
    <div className="w-full max-w-2xl mx-auto text-center text-black py-8">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        ref={searchInputRef}
        placeholder="Digite o nome do Pokémon..."
        className="w-full p-3 border rounded-md mb-4 shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
      />

      {search.trim() && (
        <>
          {isLoading && <p>Carregando Pokémon...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {pokemonList.length === 0 && !isLoading && <p>Nenhum Pokémon encontrado.</p>}

          <ul className="rounded-md shadow-md p-4 max-h-96 overflow-y-auto space-y-4">
            {pokemonList.map((pokemon, index) => (
              <li
                key={pokemon.name}
                onMouseEnter={() => setSelectedIndex(index)} // Seleciona o Pokémon ao passar o mouse
                className={`flex items-center p-4 text-lg rounded-md shadow-sm cursor-pointer ${
                  selectedIndex === index ? 'ring-2 ring-indigo-500' : ''
                }`}
                style={{ backgroundColor: getBackgroundColor(pokemon.types) }}
              >
                <img src={pokemon.sprite} alt={pokemon.name} className="w-12 h-12 mr-4" />
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