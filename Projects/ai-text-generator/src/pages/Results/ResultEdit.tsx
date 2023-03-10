import React, { FC, useState } from 'react';
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, Text, Textarea, useToast } from '@chakra-ui/react';
import { BackButton } from '../../components/BackButton';


interface ResultEditProps {
    field: string;
    isOpen: boolean;
    onClose: () => void;
    label: string;
    subLabel: string;
    onSave:  (val: string, f: string) => Promise<void>;
}
export const ResultEdit:FC<ResultEditProps> = ({field, isOpen, onClose, label, subLabel, onSave}) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const toast  =  useToast();

  let labelStyle = {
    fontSize: '20px',
    fontWeight: 500,
    color: '#262626',
    mt: '14px',
    mb: '20px'
  };

  let subLabelStyle = {
    fontSize: '16px',
    fontWeight:  600,
    color:  '#413737',
    mb: '18px'
  };
  const handleOnClick =  async () => {
     setIsLoading(true)
     await onSave(content,  field)
     setIsLoading(false);
     toast({
      status: 'success',
      title: `successfully updated`,
      position: 'top-right',
      isClosable: true,
    });
  }

  return (
    <Modal  isOpen={isOpen} onClose={onClose} size={'full'} >
    <ModalContent  px={'20px'} pt={'14px'} > 
      <BackButton onClick={onClose}  />
      <ModalBody p={0}>
        <Text sx={labelStyle} >{label}</Text>
        <Text sx={subLabelStyle}>{subLabel}</Text>
        <Textarea onChange={(e) => setContent(e.target.value)} height={'500px'}  border={'1px solid #E3E6EE'} borderRadius={'8px'}  />
      </ModalBody>
      <ModalFooter alignItems={'stretch'} flexDir={'column'}>
        <Flex flex={1} alignItems={'center'} justifyContent={'center'} >
              <Button isLoading={isLoading} height={'54px'} w={'65%'} onClick={handleOnClick} >Save</Button>
        </Flex>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}
