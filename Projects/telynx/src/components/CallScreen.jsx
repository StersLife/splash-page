// src/components/CallScreen.js
import React, {  useEffect } from 'react';
import {  useCall } from '../context/CallContext';
import {AudioVisualizer} from 'react-audio-visualize';
import CallControls from './CallControls';
import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Center, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';

const CallScreen = () => {
  const { currentCall, audioStream, setupAudioVisualization, canvasRef } = useCall()
  useEffect(() => {
    if (currentCall && currentCall.state !== 'ringing') {
      setupAudioVisualization();
    }
  }, [currentCall, setupAudioVisualization]);

  return (
/*     currentCall && (
      <div>
        <p>Call Status: {currentCall.state}</p>
        {currentCall.state === 'ringing' ? (
          <button onClick={setupAudioVisualization}>Answer</button>
        ) : (
          <>
            <CallControls />
            {audioStream && <AudioVisualizer audio={audioStream} />}
            <canvas ref={canvasRef} width="300" height="100"></canvas>
          </>
        )}
      </div>
    ) */
    <Modal  isOpen={currentCall && currentCall.state === 'ringing'}>
            <ModalOverlay />

<ModalContent bg={'transparent'}>
<ModalBody  p={0}>
  <Box 
    backgroundColor="#2e2e2e" 
    color="white" 
    borderRadius="lg" 
    boxShadow="md" 
    overflow="hidden"
  >
    <Flex alignItems="center" p={3} backgroundColor="#3e3e3e" borderBottom="1px" borderColor="#4e4e4e">
      <Avatar src="profile-pic.png" size="md" name="Gabrielle Davis" marginRight={3} />
      <Box>
        <Text fontWeight="bold">Gabrielle Davis</Text>
        <Text color="#888">Incoming call</Text>
      </Box>
    </Flex>
    <Flex alignItems="center" p={5}>
      <Center 
        width="50px" 
        height="50px" 
        backgroundColor="#9147ff" 
        color="white" 
        borderRadius="full" 
        fontSize="24px" 
        marginRight={5}
      >
        T
      </Center>
      <Box>
        <Text fontWeight="bold">Telnyx Number</Text>
        <Text color="#ccc">is calling 😆 Gabrielle Davis</Text>
      </Box>
    </Flex>
    <Flex justifyContent="space-around" p={3} backgroundColor="#3e3e3e" borderTop="1px" borderColor="#4e4e4e">
      <Button 
        leftIcon={<CloseIcon />} 
        backgroundColor="#e74c3c" 
        color="white" 
        _hover={{ backgroundColor: "#c0392b" }}
      >
        Decline
      </Button>
      <Button 
        leftIcon={<PhoneIcon />} 
        backgroundColor="#2ecc71" 
        color="white" 
        _hover={{ backgroundColor: "#27ae60" }}
      >
        Accept
      </Button>
    </Flex>
    <Box textAlign="center" p={3} backgroundColor="#3e3e3e" color="#888" fontSize="sm" borderTop="1px" borderColor="#4e4e4e">
      Declining a call still allows others in the shared inbox to pick up
    </Box>
  </Box>
  </ModalBody>
</ModalContent>

    </Modal>

  
  );
};

export default CallScreen;