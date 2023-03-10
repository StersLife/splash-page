import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import React, { FC } from 'react';


const  Progress:FC<any> = ({progressLabel , isActive}) => {

    return   (
        <Box flex={1}>
            <Box  bg={ isActive ? '#FD815C' : '#E3E6EE'}  w={'100%'} h={'6px'} borderRadius={'5px'} />
            <Text textTransform={'capitalize'}  fontWeight={600} fontSize={'12px'} color={isActive ? '#FD815C;' : '#848C9E'}  textAlign={'center'} mt={'4px'} >{progressLabel}</Text>
        </Box>
    )
}



export const ProgressBar:FC<any> = ({config = [],  currentStep, arrayOfProgress=[] }) => {

  let isActive = (el: any) => arrayOfProgress.length ? arrayOfProgress.includes(el) : el === currentStep
  return (
   <HStack  spacing={'10px'} width={'100%'} >
        {
            config.map((el: any) => <Progress  progressLabel={el}  isActive={isActive(el)}  />)
        }
   </HStack>
  )
}
