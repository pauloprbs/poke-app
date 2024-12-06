import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFetchData } from './hooks/useFetchData';

import WelcomePolidex from './components/WelcomePolidex';
import PokemonSearch from './components/PokemonSearch';

// Renomeando a variável local para evitar conflito
const myQueryClient = new QueryClient();

function App() {
  const { data, isLoading, error } = useFetchData();

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <QueryClientProvider client={myQueryClient}>
      <div>
        <WelcomePolidex />
        <PokemonSearch />
      </div>
    </QueryClientProvider>
  );
}

export default App;