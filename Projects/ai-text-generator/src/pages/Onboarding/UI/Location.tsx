import { Box, Divider, Flex, Text } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { Count } from '../../../components/Count'
import { LocationSuggestion } from '../../../components/LocationSuggestion'
import { useOnboardingContext } from '../../../context/onboardingContext'

export const Location = () => {
  // @ts-ignore
  const { setLocation, setCounts, counts } =  useOnboardingContext();
  const { bedrooms, bathrooms, occupency } = counts;
  const  ref = useRef();


    
  let countContainerStyle  =  {
    border: '1px solid #E3E6EE',
    borderRadius: '8px',
    padding: '10px 20px',
  };
  let sx = {
      borderRight: '1px solid #E3E6EE',
      flex: 1
  };


  const handleCountChange  = (val: number,  name: string) => {
    setCounts({
      ...counts,
      [name]: val
    })
  }


  return (
    <Box>
        <LocationSuggestion   onLocationClick={(el: any) =>  setLocation({locationText: el.place_name, coordinates: el.geometry.coordinates})} />

        <Divider my={'16px'} />

        <Flex sx={countContainerStyle} justifyContent={'space-between'} >
          <Count  handleChange={handleCountChange}  sx={sx} label={'bathrooms'} count={bathrooms}  />
          <Count  handleChange={handleCountChange} sx={{
           ...sx,
              alignItems: 'center'
            
          }} label={'bedrooms'} count={bedrooms} />
          <Count  handleChange={handleCountChange} sx={{
              ...sx,
              alignItems: 'flex-end',
              borderRight: 0
            
          }} label={'occupency'} count={occupency} />
        </Flex>
    </Box>
  )
}
