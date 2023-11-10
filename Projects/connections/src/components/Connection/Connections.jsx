import React, { useState } from 'react';

import { Box, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { Hospitable } from './Hospitable'


const ApiComponentObject = {
    'Hospitable': <Hospitable />
}

const APIBOX = ({
    src,
    apiName,
    onClick
}) => {

    return (
        <Box onClick={() => onClick(apiName)} cursor={'pointer'} border={'1px solid'} flexDir={'column'} borderColor={'gray.300'} borderRadius={4}  p={2} display={'flex'} alignItems={'center'} justifyContent={'center'} >
            <Image w={'100px'} height={'100px'} src={src}  />
            <Text >{apiName}</Text>
        </Box>
    )
}

export const Connections = () => {
 const [apiName,setApiName] = useState('');
  return (
    <Box p={4}>
        <Text p={4} textAlign={'center'} fontSize={'18px'} >All the APIs you can connect</Text>
        <HStack>
        <APIBOX onClick={(name) => setApiName(name)} src={'https://hospitable.com/wp-content/uploads/2020/08/Hospitable_Website_header.svg'} apiName={'Hospitable'} />
        
        </HStack>

        {
            ApiComponentObject[apiName] && (
                <Modal isOpen={apiName.length} onClose={() => setApiName('')}>
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton/>
                  <ModalBody>
                  {
                    ApiComponentObject[apiName]
                  }
                  </ModalBody>
                </ModalContent>
              </Modal>
            )
        }
    </Box>
  )
}
