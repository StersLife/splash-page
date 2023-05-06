import React from 'react';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';


function App() {
  return (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </Routes>
  );
}

export default App;
