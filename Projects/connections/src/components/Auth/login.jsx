import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { emailAndPasswordSignin, gmailAuth } from './../../firebase/auth';
import { validateEmailAndPassword } from '../../utils/validation';
import { mapFirebaseErrorToMessage } from '../../utils/firebase';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoginState, setGoogleLoginState] = useState({
    error: null,
    isLoading: false,
  });

  const handleGoogleLogin = async () => {
    setGoogleLoginState({
      error: null,
      isLoading: true,
    });
    try {
      const result = await gmailAuth();
      setGoogleLoginState({
        ...googleLoginState,
        isLoading: false,
      });
      window.location.href = '/';
    } catch (error) {
      handleErrorMessage(error.message);
    }
  };

  const handleEmailLogin = async (e) => {
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
      const user = await emailAndPasswordSignin(email, password);
      setLoading(false);
      window.location.href = '/';
    } catch (error) {
      mapFirebaseErrorToMessage(error.code, setError);
      setLoading(false);
    }
  };

  const handleErrorMessage = (message) => {
    setError(message);
    setGoogleLoginState({
      error: message,
      isLoading: false,
    });
  };



  useEffect(() => {
    if (error) {
      setError(false);
    }
  }, [email, password]);

  return (
    <Box mx={'auto'} mt={'10%'} width="450px" p={4} borderWidth="1px" borderRadius="md">
      <Button
        isLoading={googleLoginState.isLoading}
        colorScheme="red"
        variant="solid"
        onClick={handleGoogleLogin}
      >
        Google Login
      </Button>
      {googleLoginState.error && (
        <Text my={2} color={'red.300'}>{googleLoginState.error}</Text>
      )}
      <Text mt={4}>OR</Text>
      <form onSubmit={handleEmailLogin}>
        <FormControl mt={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
          />
        </FormControl>
        {error && (
          <Text color="red" mt={2}>
            {error}
          </Text>
        )}
        <Button
          type="submit"
          colorScheme="blue"
          variant="solid"
          mt={4}
          isLoading={loading}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};