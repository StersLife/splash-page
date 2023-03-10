import React, { FC, useEffect, useRef, useState } from 'react';
import { Box, Flex, Input, Text, useOutsideClick } from '@chakra-ui/react'

import { BiTargetLock, BiMap }  from 'react-icons/bi';


let containerStyle = {
bg: ' #FFFFFF',
borderRadius: '10px',
padding: '10px 15px'
}

export const LocationSuggestion:FC<any> = ({ onLocationClick}) => {

  const [searchText, setSearchText] = useState<string>('');
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const ref = useRef();

  useOutsideClick({
    // @ts-ignore
    ref: ref,
    handler: () => setShow(false),
  })


  const handleMapSearch =  async (searchText: string) => {

    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?types=country,address,place&access_token=pk.eyJ1IjoiaGltZWwxMjYiLCJhIjoiY2wxZ2FoeHM4MDd2OTNyb3JlcHZub3R4biJ9.iXUC5niBfA83FT2MYlWvpg&autocomplete=true&country=US`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (data.features.length) {
          setSuggestions(data.features);
          setShow(true)
          
      }

  } catch (error) {
       console.log('Error fetching data, ', error);
  }
  }


  const handleClick = (val: string) =>  {
    onLocationClick(val);
    setShow(false)
  }
  
  let shouldShow = ()  => !!searchText  && suggestions.length && show;
  return (
/* @ts-ignore */
    <Flex ref={ref} alignItems={'center'} sx={containerStyle} position={'relative'}>
      <Box><BiMap fontSize={'20px'} color={'#FE7146'} /></Box>
      <Box ml={'12px'} flex={1}> 
        <Text fontSize={'13px'} color={'#848C9E'} fontWeight={500} lineHeight={'14px'} >Where</Text>
        <Input  value={searchText} onChange={(e)  => {
          const val =  e.target.value
          setSearchText(val);
          handleMapSearch(val)
              
              }} fontSize={'13px'} color={'#282A2F'} fontWeight={500} lineHeight={'18px'} flex={1} variant={'unstyled'} />
      
      </Box>
      <Box bg={'#FFF8F6'} padding={'10px'} borderRadius={'6px'}><BiTargetLock color='#FE7146' /></Box>
      {
        shouldShow() && (
<Box  pos={'absolute'} bg={'white'} borderRadius={'6px'}  width={'100%'}  left={0} top={'65px'} zIndex={1} >
         {
          suggestions.map((el: any) => (
            <Box onClick={() =>{
              console.log({el})
               handleClick(el);
              setSearchText(el.place_name)
              }} _hover={{
              bg: '#E3E6EE'
            }} cursor={'pointer'}  p={'10px'} my={'12px'} display={'flex'} alignItems={'center'} > <BiMap fontSize={'20px'}   color={'#FE7146'} /> <Text  ml={1} >{el.place_name
            }</Text></Box>
          ) )
         }
      </Box>
        )
      }

    </Flex>
  )
}
