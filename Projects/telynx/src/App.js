// src/App.js
import React, { useEffect } from 'react';
import { TelnyxRTCProvider } from '@telnyx/react-client';
import { CallProvider } from './context/CallContext';
import Dialer from './components/Dialer';
import CallScreen from './components/CallScreen';
//CSS
import './styles/styles.css'
import { TelnyxRTC } from '@telnyx/webrtc';
import { ChakraProvider } from '@chakra-ui/react'



const App = () => {
  const credential = {
    login: 'sterling67028',
    password: 'J2jGD6Le',
  };

 
  return (
    <ChakraProvider>
        
     <CallProvider>
        <div className="App">
          <Dialer />
          <CallScreen />
          <audio id='remoteStreamCall'></audio>
        </div>
      
      </CallProvider>
</ChakraProvider>
  )
}
export default App;