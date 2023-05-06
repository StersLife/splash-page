import { Box, Button, Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import AuthProvider from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import CustomForm from '../../components/CustomForm';
import CustomSelect from '../../components/CustomSelect';
import { foundOn } from '../../utils/config';
import { FaChevronLeft } from 'react-icons/fa';
import { QuestionsSelection1 } from './signup steps/QuestionsSelection1';
import { QuestionsSelection2 } from './signup steps/QuestionsSelection2';
export const boxStyle = {
  flexDirection: 'column',
  boxShadow: '0px 0px 24px rgba(0, 0, 0, 0.07)',
  padding: '24px 28px 28px 40px',
  border: '1px solid #EFF1F4',
};

export const Signup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { userCredentials, step, setStep } = useContext(AuthProvider);
  
    const [isLargerThan450] = useMediaQuery('(min-width: 450px)');
    const navigate = useNavigate();
  
    useEffect(() => {
      step === 1 && setIsLoading(false);
    }, []);
  
    const handleChange = e => {
      // console.log(e);
    };
  
  
  return (
    <>
    {/* Register Section */}
    {step === 1 && (
      <Flex justify={'center'} align={'center'} height={'100vh'}>
        <Box
          minW={'100%'}
          display={'flex'}
          alignItems={'center'}
          flexDirection={'column'}
        >
          <Flex
            sx={{ ...boxStyle, minWidth: isLargerThan450 ? '460px' : '100%' }}
          >
            <CustomForm
              value={'email'}
              type="email"
              errorMessage={'Email'}
              handleChange={handleChange}
              label={'Work email'}
            />
            <CustomForm
              value={'password'}
              type="password"
              errorMessage={'Password'}
              handleChange={handleChange}
              label={'Set a password'}
            />

            <Button
              width={'100%'}
              color={'#fff'}
              isLoading={isLoading}
              marginTop={'2.3rem'}
              height={'3rem'}
              borderRadius={'4px'}
              background={'#212B36'}
              onClick={() => {
                userCredentials.email !== '' &&
                  userCredentials.password !== '' &&
                  setStep(step + 1);
                setIsLoading(step === 1 ? false : true);
              }}
              boxShadow={'0px 1px 2px rgba(0, 0, 0, 0.07)'}
              _hover={{ background: '#27333F' }}
            >
              Create an account
            </Button>
          </Flex>
          <Box
            maxW={'340px'}
            mt={'1rem'}
            textAlign={'center'}
            fontSize={'14px'}
          >
            <Text>
              You acknowledge that you read, and agree to our{' '}
              <Text
                as="a"
                href="#terms-of-service"
                color={'#6B6F76'}
                _hover={{ textDecoration: 'underline' }}
              >
                Terms of Service
              </Text>{' '}
              and our{' '}
              <Text
                as="a"
                href="#privacy-policy"
                color={'#6B6F76'}
                _hover={{ textDecoration: 'underline' }}
              >
                Privacy Policy.
              </Text>
            </Text>
            <Text
              mt="1rem"
              onClick={() => navigate('/login')}
              cursor={'pointer'}
            >
              Already have an account?
            </Text>
          </Box>
        </Box>
      </Flex>
    )}

    {step !== 1 && (
      <Button
        color={'#263238'}
        onClick={() => setStep(step - 1)}
        justifySelf={'start'}
        gap=".5rem"
        align="center"
        fontSize={'14px'}
        top="50px"
        left={'40px'}
        position={'absolute'}
        zIndex={100}
      >
        <FaChevronLeft />
        Back
      </Button>
    )}

    {/* Questions Section */}
    {step === 2 && <QuestionsSelection1 isLargerThan450={isLargerThan450} />}

    {step === 3 && <QuestionsSelection2 isLargerThan450={isLargerThan450} />}
  </>
  )
}
