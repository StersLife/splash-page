import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import CustomSelect from "../../../components/CustomSelect";
import { clients, industries, sizes, types } from "../../../utils/config";
import { boxStyle } from "../Signup";

export const QuestionsSelection2 = ({ isLargerThan450 }) => {
    const [credentials, setCredentials] = useState({
      industry: '',
      companySize: '',
      clients: '',
      typeOfService: '',
    });
  
    const handleChange = e => {
      setCredentials({
        ...credentials,
        [e.id]: e.value,
      });
    };
    return (
      <Flex
        minW={'100%'}
        alignItems={'center'}
        flexDirection={'column'}
        justify={'center'}
        height={'100vh'}
      >
        <Box my="4rem" textAlign={'center'}>
          <Text fontSize={'24px'} mb=".5rem" fontWeight={'400'}>
            Tell us more about your company
          </Text>
          <Text fontSize={'13px'}>
            This information lets us custimize your experience
          </Text>
        </Box>
        <Flex sx={{ ...boxStyle, minWidth: isLargerThan450 ? '460px' : '100%' }}>
          <CustomSelect
            options={industries}
            value={'industry'}
            label={'Which industry are you in?'}
            errorMessage={'Industry'}
            handleChange={handleChange}
          />
          <CustomSelect
            options={sizes}
            value={'companySize'}
            label={'How large is your company?'}
            errorMessage={'Company size'}
            handleChange={handleChange}
          />
          <CustomSelect
            options={clients}
            value={'clients'}
            label={'How many clients do you have?'}
            errorMessage={'Clients count'}
            handleChange={handleChange}
          />
          <CustomSelect
            options={types}
            value={'typeOfService'}
            label={'Do you companies, individuals, or a mix of both?'}
            errorMessage={'Client type'}
            handleChange={handleChange}
          />
  
          <Button
            width={'100%'}
            color={'#fff'}
            isDisabled={Object.values(credentials).includes('')}
            marginTop={'2.3rem'}
            height={'3rem'}
            borderRadius={'4px'}
            sx={{}}
            background={'#212B36'}
            onClick={() => {
              // setStep(step + 1);
            }}
            border={'1px solid #DFE1E4'}
            _hover={{ background: '#27333F' }}
            _disabled={{ background: '#fff', color: '#90959D' }}
          >
            Launch Portal
          </Button>
        </Flex>
      </Flex>
    );
  };