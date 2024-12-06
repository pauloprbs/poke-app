import { QueryClient } from '@tanstack/react-query';
import { Pokemon } from './src/types/Pokemon';

// Cria uma instância do queryClient
export const queryClient = new QueryClient();

// Define as opções padrão para as queries
queryClient.setDefaultOptions({
  queries: {
    placeholderData: (previousData: Pokemon[] = []) => previousData, // Especifica o tipo de previousData
  },
});