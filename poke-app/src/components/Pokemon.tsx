import React from 'react';
import { Pokemon as PokemonType } from '../types/Pokemon';

interface PokemonProps extends PokemonType {}

const Pokemon: React.FC<PokemonProps> = ({ name, id, type }) => {
  return (
    <li className="p-3 text-lg border-b last:border-none text-black">
      <div className="flex justify-between">
        <span>{name}</span>
        <span>ID: {id}</span>
        <span>Tipo: {type}</span>
      </div>
    </li>
  );
};

export default Pokemon;