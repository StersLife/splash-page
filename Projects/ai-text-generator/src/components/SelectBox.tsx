import React, { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { MdDone } from 'react-icons/md';





const CheckedBox:FC<any> = ({ isSelected, variant = 'float' }) => {

  let checkedBoxContainerStyle = {
    bg: isSelected ? '#FE7146': '',
    borderRadius:"100%",
    border:'2px solid #FDCBBD',
    ...(variant === 'float' && {
      pos:'absolute',
      top:'8px',
      right:'12px',
    })
  }
  return (
    <Box w={'20px'} height={'20px'} sx={checkedBoxContainerStyle}  >
            {
                isSelected  && (
                    <MdDone fontSize={'15px'} color={'white'}  />
                    )
                }
        </Box>
  )
}

export const SelectBox:FC<any> = ({label, icon, value, onSelect, variant}) => {
  let isSelected =  Array.isArray(value) ?  value.includes(label) : label ===  value;
  let selectBoxContainerStyle = {
   bg:  'white',
   borderRadius: '8px',
   boxShadow: '20px 20px 80px rgba(118, 161, 201, 0.2)',
   filter: 'drop-shadow(0px 2px 1px rgba(111, 152, 214, 0.1))',
   cursor:'pointer',
    ...(isSelected  && {  bg: '#FFF8F7', border: '1px solid #FE7146'})
  };


  let  variantStyle = {
    flexDir: 'raw',
    alignItems:'center',
    justifyContent:'space-between'
  }

  return (
    <Flex     onClick={() => onSelect(label)}  sx={{...selectBoxContainerStyle,...(variant === 'side'  ? variantStyle: {flexDir: 'column'})}} p={'27px 20px'} pos={'relative'}  >
      {
        icon && (
          <Box mb={'16px'} color={'#494949'}>
            {icon}
          </Box>
        )
      }
        <Text fontWeight={500} fontSize={'20px'}   color={'#262626'}  >{label}</Text>
        <CheckedBox isSelected={isSelected} variant={variant}  />

    </Flex>
  )
}
