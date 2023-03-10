import React, { FC, useRef, useState } from 'react';
import { Box, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { FiChevronLeft } from 'react-icons/fi'

export const AuthInput:FC<any> = ({label, rightIcon = <FiChevronLeft /> ,inputProps, handleChange}) => {
  const [isFocused, setIsFocused] = useState(false)

  const ref = useRef(null);

  let  formElementContainer = {
   border: '1px solid #DAE4FD',
    borderRadius: '8px',
    bg: '#FFFFFF',
    padding: '12px 21px'
  }


  return (
    // @ts-ignore
    <Flex  onClick={()  =>  ref.current.focus()}  sx={formElementContainer}  mt={3} cursor={'pointer'}   >
        <FormControl isRequired >
          <Flex alignItems={'center'}>
              <Box flex={1} pos="relative">
                {label &&  <FormLabel   cursor={'text'} position={'absolute'}  color={'#464859'} fontWeight={500} bottom={'3px'} fontSize={'16px'}
                /* @ts-ignore */
                 sx={{...((inputProps.value || isFocused ) && { fontsize: '15px', bottom: '16px'})}}>{label}</FormLabel> }
                <Input color={'#262626'} fontWeight={500}  onFocus={() => setIsFocused(true)} onBlur={() =>   setIsFocused(false)}  ref={ref} mt={'20px'} variant={'unstyled'}   {...inputProps} onChange={handleChange} />
              </Box>
              {
                rightIcon && rightIcon
              }
          </Flex>
        </FormControl>
    </Flex>
  )
}
