import React, { FC, useState } from 'react';
import { Box, Button, Divider, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { ResultEdit } from './ResultEdit';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useParams } from 'react-router-dom';

interface CommonResultLayout {
    children: React.ReactNode;
    label: string;
    onClick?: () => void;
    
}

const  CommonResultLayout:FC<CommonResultLayout> = ({children, label, onClick}) => { 


    let buttonStyle  = {
        fontSize: '14px',
        fontWeight: 500,
        bg: '#FFF8F6',
        border: '1px solid #F9E1DB',
        borderRadius: '8px',
        color: 'black',
        width: '50px',
        height: '28px'

    }

    return (
        <Box>  
            <Flex alignItems={'center'} justifyContent={'space-between'}>
                <Text fontSize={'32px'} fontWeight={500} lineHeight={'24px'} color={'#262626'} >{label}</Text>
                <Button onClick={onClick} sx={buttonStyle} >Edit</Button>
            </Flex>
            <Box>
                {children}
            </Box>
            <Divider my={'20px'} color={'red'} />

        </Box>
    )

}

export const Results = () => {
    const [result, setResult] = useState<any>();
    const { isOpen: isDescriptionOpen, onToggle: onDescriptionClose } = useDisclosure();
    const { isOpen: isSpaceOpen, onToggle: onSpaceClose } = useDisclosure();
    const { id } = useParams<any>(); 
    let descriptionStyle = {
        fontWeight: 500,
        fontSize: '17px',
        color: '#464859',
        lineHeight: '28px'
    };

    let subLabel = {
        fontSize: '16px',
        color:  '#413737',
        lineHeight: '24px',
        fontWeight: 500
    };

    const handleSave = async (val:  string, field: string) => {
        let newResult ={ ...result };
        /* @ts-ignore */
        const ref = doc(db, 'results', id );
        await updateDoc(ref, {
            ...newResult,
            [field]: val
        })
    }


  return (
    <>
    <Box p={'15px'}  height={'100vh'} >
       <CommonResultLayout label='Title' >
        <Box mt={2}>
            <Text>Title 1</Text>
            <Text>Title 2</Text>
            <Text>Title 3</Text>
        </Box>
       </CommonResultLayout>
       <CommonResultLayout label='Description' onClick={onDescriptionClose}>
            <Text mt={'15px'} mb={'10px'} sx={subLabel} >Listing Description</Text>
            <Text  sx={descriptionStyle} >
                Real estate results refer to the outcomes or consequences of buying, selling, or    investing in real estate. Here are some examples of real estate results. Capital   gain or loss The difference between the purchase price and the sale price of a    property, which can result in a capital gain or loss for the seller.
            </Text>
       </CommonResultLayout>
       <CommonResultLayout label='Description' onClick={onSpaceClose}>
            <Text mt={'15px'} mb={'10px'} sx={subLabel} >The  space</Text>
            <Text sx={descriptionStyle} >Real estate results refer to the outcomes or consequences of buying, selling, or investing in real estate. Here are some examples of real estate results. Capital gain or loss The difference between the purchase price and the sale price of a property, which can result in a capital gain or loss for the seller.

Real estate results refer to the outcomes or consequences of buying, selling, or investing in real estate. Here are some examples of real estate results. Capital gain or loss The difference between the purchase price and the sale price of a property, which can result in a capital gain or loss for the seller.
            </Text>
       </CommonResultLayout>
    </Box>
    <ResultEdit  
        field='shortDescription'
        label='Listing Description'
        subLabel={`Give guests a sense of what it's like to stay at your place, including why they'll love staying there.`}
        isOpen={isDescriptionOpen}
        onClose={onDescriptionClose}
        onSave={handleSave}
    />  
    <ResultEdit  
        field='theSpace'
        label='The Space'
        subLabel={`Provide a general description of what the property and rooms are like so guests know what to expect.`}
        isOpen={isSpaceOpen}
        onClose={onSpaceClose}
        onSave={handleSave}

    />  
    </>
  )
}
