import { Box, Flex, useOutsideClick } from '@chakra-ui/react'
import React, { FC, useRef } from 'react'

export const ActionBox:FC<any> = ({children, isOpen, onToggle}) => {
  const ref  = useRef();

  useOutsideClick({
    // @ts-ignore
    ref,
    handler: ()  => {
      isOpen && onToggle()
    }

  })
  if(!isOpen) return null;

  return (
    <Flex   zIndex={99} flexDir={'column'}  justifyContent={'flex-end'} height={'100vh'} bg={'rgba(109, 93, 93, 0.85)'} position={'absolute'} left={0} w={'100%'} top={'0'} >
      {/* @ts-ignore */}
        <Box py={3} ref={ref} height={'max-content'} bg={'#F5F9FF'} borderRadius={'8px 8px 0px 0px'}  >
            {children}
        </Box>
    </Flex>

  )
}
