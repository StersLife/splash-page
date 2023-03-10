import { Box } from '@chakra-ui/react'
import React from 'react'
import { useOnboardingContext } from '../../../context/onboardingContext'
import { propertyTypeArray } from '../../../utils/config'
import { MultipleSelectLayout } from './MultipleSelectLayout'

export const Property = () => {
  /* @ts-ignore */
  const {  selectedPropertyType, setSelectedPropertyType } = useOnboardingContext();

  return (
    <Box>
      <MultipleSelectLayout
        items={propertyTypeArray}
        selectedItems={selectedPropertyType}
        setSelectedItems={setSelectedPropertyType}
      />
    </Box>
  )
}
