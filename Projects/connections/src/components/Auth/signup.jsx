import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { emailAndPasswordSignup, gmailAuth } from './../../firebase/auth';
import { validateEmailAndPassword } from './../../utils/validation';
import { mapFirebaseErrorToMessage } from './../../utils/firebase';

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleSignupState, setGoogleSignupState] = useState({
    isLoading: false,
    error: null,
  });

  const handleGoogleSignup = async () => {
    setGoogleSignupState({
      error: null,
      isLoading: true,
    });

    try {
      const result = await gmailAuth();
      setGoogleSignupState({
        ...googleSignupState,
        isLoading: false,
      });
      window.location.href = '/';
    } catch (error) {
      handleErrorMessage(error.message);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
  
    const validationResult = validateEmailAndPassword(email, password);
  
    if (!validationResult.valid) {
      handleErrorMessage(validationResult.message);
      setLoading(false);
      return;
    }
  
    try {
      setError(null);
      setLoading(true);
      const user = await emailAndPasswordSignup(email, password);
      setLoading(false);
      window.location.href = '/';
    } catch (error) {
      const errorMessage = mapFirebaseErrorToMessage(error.code);
      handleErrorMessage(errorMessage);
      setLoading(false);
    }
  };

  const handleErrorMessage = (message) => {
    setError(message);
    setGoogleSignupState({
      error: message,
      isLoading: false,
    });
  };
  useEffect(() => {
    if(error) {
       setError(false)
    }
  }, [email,password])
  return (
    <Box m='auto' mt={'10%'} width="450px" p={4} borderWidth="1px" borderRadius="md">
      <Button isLoading={googleSignupState.isLoading} onClick={handleGoogleSignup} colorScheme="blue" variant="solid">
        Google Signup
      </Button>
      {googleSignupState.error && <Text my={2} color={'red.400'}>{googleSignupState.error}</Text>}
      <Text mt={4} textAlign={'center'}>Or</Text>
      <form onSubmit={handleEmailSignup}>
        <FormControl mt={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} isRequired />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} isRequired />
        </FormControl>
        {error && <Text color="red" mt={2}>{error}</Text>}
        <Button type="submit" colorScheme="blue" variant="solid" mt={4} isLoading={loading}>
          Signup
        </Button>
      </form>
    </Box>
  );
};