import React from 'react';
import {
  ChakraProvider, theme,
} from '@chakra-ui/react';
import { AuthProvider} from './context/authContext'
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/route';
function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
