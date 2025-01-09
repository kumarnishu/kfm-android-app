import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { UserProvider } from './contexts/UserContext';
import { AlertProvider } from './contexts/AlertContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'red',
    secondary: 'white',
  },
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      retry: false,
      staleTime: 200,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <AlertProvider>
              <AppNavigator />
            </AlertProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
