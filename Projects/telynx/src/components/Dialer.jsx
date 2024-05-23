import React, { useState } from 'react';
import { useCall } from '../context/CallContext';
import { Box, Input, SimpleGrid, Button, Text, IconButton, Flex } from "@chakra-ui/react";
import { PhoneIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons"; // Import necessary icons
import { GoMute } from "react-icons/go";
import { CiVolumeHigh } from "react-icons/ci";
import { FaPause, FaPhoneAlt } from "react-icons/fa";
const Dialer = () => {
  const [number, setNumber] = useState('4356024504');
  const { handleCall: call, currentCall, callStatus  } = useCall();
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);

  const handleButtonClick = (digit) => {
    setNumber(number + digit);
  };

  const handleBackspace = () => {
    setNumber(number.slice(0, -1));
  };

  const handleClear = () => {
    setNumber('');
  };

  const handleCall = async () => {
    try {
      call('+1' + number);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Add logic to handle mute functionality
    if (isMuted) {
      currentCall.unmuteAudio();
    } else {
      currentCall.muteAudio();
    }
  };

  const toggleHold = () => {
    setIsOnHold(!isOnHold);
    // Add logic to handle hold functionality
    if (isOnHold) {
      currentCall.unhold();
    } else {
      currentCall.hold();
    }
  };
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      backgroundColor="white" 
      p={5} 
      borderRadius="lg" 
      boxShadow="md"
      maxW="300px"
      mx="auto"
    >
      <Input 
        value={number} 
        fontSize="24px" 
        textAlign="center" 
        mb={5} 
        readOnly 
      />
      {
        currentCall && (
          <Box>
        Status: {currentCall && callStatus}
        <Text>Time: </Text>
      </Box>
        )
      }
       <audio  muted={true} id="remoteMediaId"   autoPlay={true} />

      <SimpleGrid columns={3} spacing={5} mb={5}>
        {['1', '2 abc', '3 def', '4 ghi', '5 jkl', '6 mno', '7 pqrs', '8 tuv', '9 wxyz', '*', '0', '#'].map((key) => (
          <Button 
            key={key} 
            h="60px" 
            w="60px" 
            borderRadius="full" 
            backgroundColor="gray.200" 
            _hover={{ backgroundColor: "gray.300" }}
            display="flex"
            flexDirection="column"
            onClick={() => handleButtonClick(key.split(' ')[0])}
          >
            {key.split(' ')[0]}
            {key.split(' ')[1] && <Text fontSize="xs" color="gray.500">{key.split(' ')[1]}</Text>}
          </Button>
        ))}
      </SimpleGrid>
      <Box display="flex" justifyContent="space-between" w="100%">
        <Button colorScheme="red" onClick={handleClear}>Clear</Button>
        <Button colorScheme="blue" onClick={handleBackspace}>Back</Button>
      </Box>
      <Flex w={'100%'} alignItems={'center'} justifyContent={'center'}>
      {
        currentCall && (
      <IconButton 
          icon={isMuted ? <GoMute /> : <CiVolumeHigh />} 
          colorScheme={isMuted ? "red" : "gray"} 
          aria-label="Mute" 
          size="lg" 
          isRound 
          mt={5}
          onClick={toggleMute}
        />
        )
      }
 
  
        <IconButton 
          icon={ currentCall?.state === 'active' ? <FaPhoneAlt /> :  <PhoneIcon />} 
          colorScheme={ currentCall?.state === 'active' ? 'red' :   'green'} 
          aria-label="Call" 
          size="lg" 
          isRound 
          mt={5}
          mx={5}
          onClick={handleCall}
        />
        {
          currentCall && (
            <IconButton 
          icon={<FaPause />
} 
          colorScheme={isOnHold ? "yellow" : "gray"} 
          aria-label="Hold" 
          size="lg" 
          isRound 
          mt={5}
          onClick={toggleHold}
        />
          )
        }
    
      </Flex>
    </Box>
  );
};

export default Dialer;
