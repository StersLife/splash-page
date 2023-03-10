import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Flex, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { AuthInput } from './AuthInput';


import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { FaRegEnvelope } from 'react-icons/fa';
import { BackButton } from '../../components/BackButton';
import { Text } from '@chakra-ui/react';
import { GoogleAuthButton } from './GoogleAuthButton';
import { Divider } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { AuthError } from './AuthError';
import { useOnboardingContext } from '../../context/onboardingContext';

export const Login:FC<any> = ({onModeChanged, setCurrentStep}) => {
    /* @ts-ignore */
    const [error, setError] = useState<any>(null)
    const toast  = useToast();
    const  { isOpen: showPassword, onToggle } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const [loginCredentials, setLoginCredentials] = useState({
        email: '',
        password: '',
    });

    const { email, password}  = loginCredentials;

    const  handleChange =  (e: any) => {
        const  { name, value} = e.target;
        setLoginCredentials({
            ...loginCredentials,
            [name]:   value
        })
    };

    const  handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true)
        try {
          const {user} =  await signInWithEmailAndPassword(auth, email, password);
          toast({
              title: 'Account Logged in.',
              description: "Please  wait. You are being redirect!",
              status: 'success',
              duration: 4000,
              isClosable: true,
            })

            onModeChanged ? setCurrentStep('loading')  : navigate('/dashboard')

  
        } catch(err: any)  {
          const errorCode = err.code || 'unknown';
          setError({ errorCode });
        }
        setIsLoading(false)
   
    }

    useEffect(() => {
        if(error && Object.keys(error).length) setError(null);
      }, [loginCredentials])

  return (
    <Box p={'15px'} bg={'#F5F9FF'} height={'100vh'} >
        <Box>
        <Flex mb={'30px'}>
            <BackButton onClick={() => onModeChanged ? setCurrentStep('locations')  : navigate('/')} />
            <Box flex={1}>
                <Text  textAlign={'center'} color={'#262626'} fontWeight={700}  lineHeight={'24px'} fontSize={'20px'} >Your Result is Ready. <br /> Login to View</Text>
            </Box>
        </Flex>
        <GoogleAuthButton label='Login With Google' onClick={() => onModeChanged ? setCurrentStep('loading')  : navigate('/dashboard')} />

        <Divider mt={'25px'}  mb={'15px'} />
        </Box>
             <form onSubmit={handleSubmit}>
            <VStack spacing={'12px'} align={'stretch'} >
                <AuthInput  
                    label="Email"
                    rightIcon={<FaRegEnvelope fontSize={'20px'}  />  }
                    inputProps={{
                        name: 'email',
                        value: email,
                        type: 'text'
                    }}
                    handleChange={handleChange}
                />

                 <AuthInput  
                    label="Password"
                    rightIcon={showPassword ? <BsEye fontSize={'20px'} onClick={onToggle}  /> : <BsEyeSlash fontSize={'20px'}  onClick={onToggle}  />  }
                    inputProps={{
                        name: 'password',
                        value: password,
                        type: showPassword ? 'text' : 'password'
                    }}
                    handleChange={handleChange}
                />

            </VStack>

            <AuthError
                {...error}
            />


           <Flex  mt={''}>
                <Button isLoading={isLoading} height={'54px'} mx={'auto'} w={'70%'} mt={'40px'} type='submit'>Login</Button>
           </Flex>
        </form>
        <Flex  alignItems={'center'} justifyContent={'center'} mt={'30px'} color={'#797979'} fontWeight={400} >


        <Text >
            Don't have an account yet? 
        <Text as={'span'} ml={1} color={'#FE7146'} cursor={'pointer'} onClick={() => {
            onModeChanged ? onModeChanged('signup') : navigate('/signup')
        }} >Signup</Text>
        </Text>
        </Flex>
    </Box>
  )
}
