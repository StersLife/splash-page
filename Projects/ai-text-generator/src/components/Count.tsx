import React, { FC } from 'react';
import {  Flex, Text } from '@chakra-ui/react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';



export const Count:FC<any> = ({label, count, handleChange, sx}) => {
    const handleIncrease:any = (val:  number,theresold: number = 0.5) => {
        handleChange(val +  theresold, label)
    };
    const handleDecrease: any = (val:  number,theresold: number = 0.5) => {
        if(val  > 0) {
            handleChange(val - theresold, label);
        }

    };
  return (
    <Flex direction={'column'} sx={{...sx}}  >
        <Text fontSize={'14px'}  fontWeight={500} textTransform={'capitalize'} >{label}</Text>
        <Flex alignItems={'center'} my={'5px'}  >
            <AiOutlineMinus cursor={'pointer'}  onClick={() => handleDecrease(count)} color='#FE7146' />
            <Text px={2} fontWeight={600} fontSize={'15px'}  >{count}</Text>
            <AiOutlinePlus cursor={'pointer'} color='#FE7146' onClick={() => handleIncrease(count)}  />
        </Flex>
    </Flex>
  )
}
