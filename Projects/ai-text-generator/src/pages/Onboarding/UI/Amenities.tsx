import { Box, Button, Flex, Image, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { ActionBox } from '../../../components/ActionBox';

import toneImage from './../../../assets/images/tone.png';
import { SelectBox } from '../../../components/SelectBox';
import { useOnboardingContext } from '../../../context/onboardingContext';
import { MultipleSelectLayout } from './MultipleSelectLayout';
import { amenitiesArray } from '../../../utils/config';
import { useAuthContext } from '../../../context/authContext';


export const Amenities = () => {
  /* @ts-ignore */
  const { tone, setTone, isActionBoxOpen, onActionBoxToggle, selectedAmentities, setSelectedAmenities, setCurrentStep } = useOnboardingContext();
  const { currentUser } = useAuthContext()

  const handleSelect = (val: string) => {
    setTone(val)
  };

  const handleGenerate = () => {
    if (!currentUser) {
      onActionBoxToggle();
      setCurrentStep('auth')
    } else {
      setCurrentStep('loading')
    }

  }
  return (
    <Box>
      <MultipleSelectLayout
        items={amenitiesArray}
        selectedItems={selectedAmentities}
        setSelectedItems={setSelectedAmenities}
      />



      {/* ActionBox */}
      <ActionBox isOpen={isActionBoxOpen} onToggle={onActionBoxToggle}>
        <Flex alignItems={'center'} justifyContent={'center'} >
          <Image alt='illustration for selecting tone for AI' src={toneImage} />
        </Flex>
        <Text textAlign={'center'} fontWeight={700} fontSize={'20px'} lineHeight={'26px'} >Choose Your Tone that you want to <br /> generate result </Text>
        <VStack padding={'24px'} spacing={'16px'} mt={'24px'} mb={'40px'} alignItems={'stretch'} >
          <SelectBox
            variant={'side'}
            label="Friendly"
            value={tone}
            onSelect={handleSelect}
          />
          <SelectBox
            variant={'side'}
            label="Casual"
            value={tone}
            onSelect={handleSelect}
          />
          <SelectBox
            variant={'side'}
            label="Optimistic"
            value={tone}
            onSelect={handleSelect}
          />
        </VStack>
        <Flex alignItems={'center'} justifyContent={'center'} pb={'40px'} >
          <Button onClick={handleGenerate} width={'260px'} height={'55px'}  >Generate</Button>
        </Flex>

      </ActionBox>
    </Box>
  )
}
