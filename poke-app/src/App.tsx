import React from 'react';
import { useFetchData } from './hooks/useFetchData'

//header do app
import WelcomePolidex from './components/WelcomePolidex';

function App() {
  const { data, isLoading, error } = useFetchData();

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <WelcomePolidex />

      {/*
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      */}
      
    </div>
  );
}

export default App;