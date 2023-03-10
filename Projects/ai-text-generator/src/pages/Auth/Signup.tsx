import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Checkbox, Divider, Flex, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { BackButton } from '../../components/BackButton';
import { GoogleAuthButton } from './GoogleAuthButton';
import { AuthInput } from './AuthInput';

import {FaRegEnvelope} from  'react-icons/fa'
import { AiOutlineUser } from 'react-icons/ai';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { FiPhoneCall } from 'react-icons/fi';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { getOrCreateUser } from '../../lib/auth';
import { AuthError } from './AuthError';
import { useNavigate } from "react-router-dom";
import { useToast } from '@chakra-ui/react';
import { useOnboardingContext } from '../../context/onboardingContext';

export const Signup:FC<any> = ({ onModeChanged, setCurrentStep}) => {
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate =  useNavigate();
    const toast = useToast();



    const  { isOpen: showPassword, onToggle } = useDisclosure();

    const [userCredentials, setUserCredentials] = useState({
        email: '',
        fullName: '',
        password: '',
        phoneNumber: '',
        isAgreed: false
    });

    const  { email, fullName,  password, phoneNumber, isAgreed } = userCredentials;

    const  handleChange =  (e: any) => {
        const  { name, value} = e.target;
        setUserCredentials({
            ...userCredentials,
            [name]:   value
        })
    }


  const handleSubmit = async (e:  any)  =>  {
      e.preventDefault();

     if(!isAgreed) return  setError({errorCode: 'notChecked'})
      setIsLoading(true)
      try {
        const {user} =  await createUserWithEmailAndPassword(auth, email, password);
        await getOrCreateUser(user, userCredentials);
        toast({
            title: 'Account created.',
            description: "We've created your account for you.",
            status: 'success',
            duration: 9000,
            isClosable: true,
          });


          onModeChanged ? setCurrentStep('loading') : navigate('/dashboard')



      } catch(err: any)  {
        const errorCode = err.code || 'unknown';
        setError({ errorCode });
      }
      setIsLoading(false)
 
  };

  useEffect(() => {
    if(error && Object.keys(error).length) setError(null);
  }, [userCredentials])

  return (
     <Box p={'15px'} bg={'#F5F9FF'} height={'100vh'} >
        <Flex mb={'30px'}>
            <BackButton onClick={() =>  onModeChanged ? setCurrentStep('locations') : navigate('/')   } />
            <Box flex={1}>
                <Text  textAlign={'center'} color={'#262626'} fontWeight={700}  lineHeight={'24px'} fontSize={'20px'} >Your Result is Ready. <br /> Sign up to View</Text>
            </Box>
        </Flex>
        <GoogleAuthButton
            label='Sign Up With Google'
            onClick={() => onModeChanged ? setCurrentStep('loading') : navigate('/')}
         />

        <Divider mt={'25px'}  mb={'15px'} />

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
                    label="Full name"
                    rightIcon={<AiOutlineUser fontSize={'20px'}  />  }
                    inputProps={{
                        name: 'fullName',
                        value: fullName,
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
                 <AuthInput  
                    label="Phone number"
                    rightIcon={<FiPhoneCall fontSize={'20px'}  />  }
                    inputProps={{
                        name: 'phoneNumber',
                        value: phoneNumber,
                        type: 'number'
                    }}
                    handleChange={handleChange}
                />
                
            </VStack>

           <Box my={'14px'} >
            <Flex alignItems={'center'}>

                <Checkbox colorScheme={'orange'}  onChange={(e:   any) => setUserCredentials({
                    ...userCredentials,
                    isAgreed: e.target.checked
                })}   > 
                <Text   ml={2} fontWeight={400} fontSize={'17px'}  color={'#848C9E'} >I Agree With The <Text as={'span'} color={'#FE7146;'} cursor={'pointer'} onClick={(e: any) =>  {
                        e.stopPropagation()
                        {/* @ts-ignore */}
navigate('/privacy-policy')
                    } }  >Privacy Policy</Text> and 
                        {/* @ts-ignore */}
                        <Text ml={1} as={'span'} color={'#FE7146'} cursor={'pointer'}  onClick={() =>  navigate('/terms-condition')} >
                             Term and Conditions.
                        </Text>
                    </Text>
                    </Checkbox>
            </Flex>
           </Box>
           <AuthError {...error} />
           <Flex  mt={''}>
                <Button height={'54px'} mx={'auto'} w={'70%'} mt={'40px'} type='submit'  isLoading={isLoading} >Sign Up</Button>
           </Flex>
        </form>
        <Flex  alignItems={'center'} justifyContent={'center'} mt={'30px'} color={'#797979'} fontWeight={400} >

        <Text >
        Already Have an account?
        <Text as={'span'} ml={1} color={'#FE7146'} cursor={'pointer'} onClick={() => {
            onModeChanged ? onModeChanged('login') : navigate('/login')
        }} > Login</Text>
        </Text>
        </Flex>
     </Box>
  )
}
