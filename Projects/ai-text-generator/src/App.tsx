import * as React from "react"
import {
  ChakraProvider,
  Box,
} from "@chakra-ui/react"
import { RouterProvider } from 'react-router-dom';
import {router} from './router';
import { theme } from "./utils/theme";

//Font CSS
import '@fontsource/hind-vadodara/400.css';
import '@fontsource/hind-vadodara/500.css';
import '@fontsource/hind-vadodara/600.css';
import '@fontsource/hind-vadodara/700.css'; 
import { AuthContextComponent } from "./context/authContext";


export const App = () => (
  <ChakraProvider theme={theme}>
    <AuthContextComponent>
      <RouterProvider router={router}  />
    </AuthContextComponent>
  </ChakraProvider>
)