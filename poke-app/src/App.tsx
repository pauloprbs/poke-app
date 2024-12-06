import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFetchData } from './hooks/useFetchData';

// Import dos componentes
import WelcomePolidex from './components/WelcomePolidex';
import PokemonSearch from './components/PokemonSearch';
import Footer from './components/Footer';

const myQueryClient = new QueryClient();

function App() {
  const { data, isLoading, error } = useFetchData();

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <QueryClientProvider client={myQueryClient}>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <WelcomePolidex />
          <PokemonSearch />
        </div>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;