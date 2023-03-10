import React, { FC, useState } from 'react';
import { Box, Button, Image, Text, useToast } from '@chakra-ui/react'

import  GoogleImage from './../../assets/images/google.png'

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getOrCreateUser } from '../../lib/auth';
import { AuthError } from './AuthError';

const provider = new GoogleAuthProvider();

type googleAuthButtonProps = {
  label: string;
  onClick?: () => void;
}

export const GoogleAuthButton:FC<googleAuthButtonProps>= ({label, onClick}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const toast = useToast()

    let buttonStyle = {
        border: '1px solid #DAE4FD',
        fontWeight:  600,
        fontSize: '16px',
        height: '24px',
        bg: ' #FFFFFF',
        borderRadius: '8px',
        color: 'black',
        w: '100%',
        padding: '23px 0px'
    };


    const  handleGoogleSignIn = async () => {
      setIsLoading(true)
      const auth = getAuth();
      try  {
        const result = await signInWithPopup(auth, provider);
        await getOrCreateUser(result.user)
        toast({
          title: 'successfully sign in with google.',
          description: "Please  wait. You are being redirect!",
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        onClick && onClick();
      } catch(err) {
        console.log(err)
        setError({
          /* @ts-ignore */
          errorCode:  err.code || 'unknown'
        })

      }

      setIsLoading(false)
       

   }
 
  return (
    <Box onClick={handleGoogleSignIn}>
      <Button boxShadow={'none'} sx={buttonStyle} isLoading={isLoading} >
          <Image alt='Google-image' src={GoogleImage} />
          <Text ml={'20px'}>{label}</Text>
      </Button>
      <AuthError  {...error}  />
    </Box>
  )
}
