import React from 'react';
import { Box } from '@chakra-ui/react'
import { useOnboardingContext } from '../../../context/onboardingContext'
import { descriptorArray } from '../../../utils/config'
import { MultipleSelectLayout } from './MultipleSelectLayout'

export const Descriptor = () => {
  // @ts-ignore
  const { selectedDescriptor, setSelectedDescriptor  } = useOnboardingContext();

  return (
    <Box>
      <MultipleSelectLayout
        items={descriptorArray}
        selectedItems={selectedDescriptor}
        setSelectedItems={setSelectedDescriptor}
      />
    </Box>
  )
}
