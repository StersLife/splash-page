import React from 'react';
import { Box, } from '@chakra-ui/react'
import { activitiesArray } from '../../../utils/config';
import { useOnboardingContext } from '../../../context/onboardingContext';
import { MultipleSelectLayout } from './MultipleSelectLayout';

export const Activities = () => {
  /* @ts-ignore */
  const {  selectedActivities, setSelectedActivities } = useOnboardingContext();

  return (
   <Box>  
      <MultipleSelectLayout
        items={activitiesArray}
        selectedItems={selectedActivities}
        setSelectedItems={setSelectedActivities}
      />
   </Box>
  )
}
