import { Box, Button, Flex, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import Upload from './Upload';
import { analyzeImage } from '../api/openai';
import Markdown from 'react-markdown';

const airbnbListingsPhoto = `I'm going to give you two pictures and you are going to tell me things to improve for my airbnb listing. It's of the same room first you are going to tell me which picture I should upload and the second you are going to tell me what would make more appealing`;


const prompt2 = `Now I'm going to upload couple of pictures and you are going to tell me which one and why it should be made the cover photo on my listing.`

const prompt3 = `Instruction:

Analyze the provided images.
Rank the images based on the following criterion: " " (e.g., overall composition, clarity, visual appeal for a target audience).
Assign a score (0.0 to 10.0) to each image, with 10.0 being the best and 0.0 being the worst.
Provide a detailed explanation for the ranking and score of each image. Be critical and focus on specific aspects like:
Compositional strengths and weaknesses (rule of thirds, leading lines, etc.)
Technical aspects (lighting, focus, sharpness)
Aesthetic elements (color harmony, subject matter, emotional impact)
Relevance to the chosen criterion`


const ImageAnalysis = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(1)
  const [loading, setLoading] = useState(false); // Add state for loading indication
  const [error, setError] = useState(null); // Add state for error handling
  const [dataChunk, setDataChunk] = useState('')
    const [originalImages, setOriginalImages] = useState([]);

    const handleSetDataChunk = (chunk) => {
 

      setDataChunk((prevDataChunk) => prevDataChunk + chunk);
     }
    const handleInpaint = async () => {
      if (!originalImages.length) return;
  setLoading(true)
  // Create an array of promises for each image conversion
  const imagePromises = originalImages.map(image => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });
  });

  // Wait for all promises to resolve before logging or using the images
  const images = await Promise.all(imagePromises);
  let imgAIFormate = []

  images.forEach(image => {

imgAIFormate.push( {
  "type": "image_url",
  "image_url": {
    "url": image,
  },
})

 
   })
   const prompt = selectedPrompt  === 1 ? airbnbListingsPhoto : selectedPrompt === 2 ? prompt2 : prompt3;
  await analyzeImage(imgAIFormate, prompt, handleSetDataChunk, setLoading, loading)
 
}
    const handleFileUpload = (selectedFiles) => {
      setOriginalImages(selectedFiles);
      // No need for blobUrl as we'll use the files directly
    };
    
    return (
      <Box p={4}>
        <Upload onFileUpload={handleFileUpload} />
        <Box my={3}>

        <Text>Prompt</Text>
        <HStack mt={3}>
        {Array(3).fill(null).map((el, idx) => (
  <Button sx={(idx + 1) === selectedPrompt && {
    bg: 'blue.400',
    color: 'white',
  }} key={idx} onClick={() => setSelectedPrompt(idx + 1)}>
    Prompt {idx + 1}  
  </Button>
))}

        </HStack> 
        {selectedPrompt === 1 &&( <Text>{airbnbListingsPhoto}</Text>)}
{selectedPrompt ===2 &&( <Text>{prompt2}</Text>)}
{selectedPrompt === 3 &&( <Text>{prompt3}</Text>)}
        </Box>
        <Button mt={4} onClick={handleInpaint}>
          Analyse
        </Button>
        {originalImages.length > 0 && (
  <Flex mt={4} gap={4}>
    {originalImages.map((image, index) => (
      <Box key={index}>
        <Image w={'250px'} h={'250px'} src={URL.createObjectURL(image)} alt={`Original Image ${index + 1}`} />
      </Box>
    ))}
  </Flex>
)}
{loading && <Spinner size="lg" mx="auto" my={3} />} {/* Display spinner while loading */}
<Box m={3}>
<Markdown>

{dataChunk } 
</Markdown>

</Box>

      </Box>
    );
}

export default ImageAnalysis;