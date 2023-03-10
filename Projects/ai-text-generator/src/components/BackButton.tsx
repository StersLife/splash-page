import React, { FC } from 'react';
import { Box } from '@chakra-ui/react'

import  { FiChevronLeft } from 'react-icons/fi';

export const BackButton: FC<any> = ({icon , onClick}) => {
    let  styleTopIcon  = {
        border: '1px solid #E3E6EE',
        padding:  '5px',
        borderRadius: '8px',
        height: 'max-content',
        width: 'max-content',
        cursor: 'pointer'
    };
  return (
    <Box  sx={styleTopIcon}  onClick={onClick}>
       {icon ? icon : <FiChevronLeft fontSize={'25px'} /> } 
    </Box>
  )
};
