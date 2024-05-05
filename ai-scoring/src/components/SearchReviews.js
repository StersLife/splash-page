import { Box, Button, Card, CardBody ,CardHeader, Flex, Heading, Input, ListItem, Spinner, Text, UnorderedList, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '../hooks';
import { fetchAllReviews } from '../api/rapidapi';
import { generateReviewAnalysis } from '../api/openai';
import Markdown from 'react-markdown'
import LinkPreview from './LinkPreview';


const parseCode = (code) => {
  try {
    // Remove surrounding triple backticks and trim whitespace
    const jsonString = code.replace(/^```(?:javascript|js)?|```$/g, '').trim();
    // Parse the JSON string to JavaScript object
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.error('Error parsing code:', error);
    return null;
  }
};

const extractIdFromUrl = (url) => {
  // Split the URL at the question mark (?) to separate path and parameters
  const urlParts = url.split('?');

  // Extract the path (first part)
  const path = urlParts[0];

  // Regular expression to match the last segment of the path
  const regex = /\/rooms\/([^/]+)$/;

  // Test the path against the regular expression
  const match = path.match(regex);

  // If there's a match, return the captured group (the ID)
  if (match) {
    return match[1];
  }

  // If no match, return null
  return null;
};
const GuestExperienceCard = ({data}) => {
  const { sentiment, themes, issues, experienceSummary } = data

  const positiveTheme = Object.keys(themes);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Camper and Cabin Guest Experience</Heading>
      </CardHeader>
      <CardBody>
        <Text>
          <Text as="strong">Overall Sentiment:</Text> {sentiment.overallSentiment}
        </Text>
        <Text my={2} as="strong" color={'#FF6C71'} >{sentiment.ratingDiscrepancies}</Text>

        <VStack spacing={4}>
          <Text>
            <Text as="strong">Positive Reviews ({positiveTheme.length} themes):</Text>
            <UnorderedList>
            {positiveTheme.map((key) =>  <ListItem key={key}> <Text fontWeight={'bold'}> {key}:</Text> {themes[key]}</ListItem> )}
  
            </UnorderedList>
          </Text>
         <Text> 
            <Text as="strong">Negative Feedback ({Object.keys(issues).length} issues):</Text>
            <UnorderedList>
            {Object.keys(issues).map((key) =>  <ListItem key={key}> <Text fontWeight={'bold'}> {key}:</Text> {issues[key]}</ListItem> )}

            </UnorderedList>
         </Text> 
          <Text>{experienceSummary}</Text>
        </VStack>
      </CardBody>
    </Card>
  );
};
const SearchReviews = () => {
  const [propertyUrl, setPropertyUrl] = useState('');
  const [reviews, setReviews] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false); // Add state for loading indication
  const [error, setError] = useState(null); // Add state for error handling
  const [dataChunk, setDataChunk] = useState('')

  const url = useDebounce(propertyUrl, 700);


  const handleSetDataChunk = (chunk) => {
 

   setDataChunk((prevDataChunk) => prevDataChunk + chunk);
  }
  const handleSearch = async () => {
    setLoading(true); // Set loading state to true before making API calls
    setError(null); // Clear any previous errors

    try {
      const reviews = await fetchAllReviews(extractIdFromUrl(url));
      console.log(reviews);

      let filteredReviews = reviews.data.reviews.map((review) => ({
        comments: review.comments,
        rating: review.rating,
        ratingAccessibilityLabel: review.ratingAccessibilityLabel,
        reviewHighlight: review.reviewHighlight,
        reviewee: review.reviewee,
        reviewer: review.reviewer,
      }));

      const analysis = await generateReviewAnalysis(filteredReviews, handleSetDataChunk, setLoading, loading);
      const parsed = parseCode(analysis);
      setAnalysis(parsed);
      setReviews(reviews);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching reviews.'); // Handle potential errors
    } finally {
      setLoading(false); // Set loading state to false after API calls are complete
    }
  };

  return (
    <Box width={'600px'} maxW={'100%'} margin={'auto'}>
      <Text fontSize={'24px'} textTransform={'capitalize'} textAlign={'center'} my={3}>
        Input your property Airbnb url to see review sentiment!
      </Text>

      <Flex p={2}>
        <Input value={propertyUrl} onChange={(e) => setPropertyUrl(e.target.value)} />
        <Button onClick={handleSearch} ml={2}>
          Search
        </Button>
      </Flex>

{
  url && <LinkPreview url={url} />
}

      {loading && <Spinner size="lg" mx="auto" my={3} />} {/* Display spinner while loading */}

      {error && <Text color="red.500" textAlign="center">{error}</Text>} {/* Display error message */}

        {analysis && <Box my={3}>
      <GuestExperienceCard data={ analysis} />
      </Box>}   {/* Display analysis only if available */}

      <Box>
      <Markdown className={'markdown-ai'}>
        {dataChunk } 
      </Markdown>
      </Box>
    </Box>
  );
};

export default SearchReviews;