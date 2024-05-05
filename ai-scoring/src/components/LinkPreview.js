import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Image, Link } from '@chakra-ui/react';

const LinkPreview = ({ url }) => {
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:9000/metadata?url=${ url}`); // Replace with your API endpoint
        const data = await response.json();
        setPreviewData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  if (error) {
    return <Text color="red.500">Error fetching preview: {error}</Text>;
  }

  if (!previewData) {
    return <Text>Loading preview...</Text>;
  }

  const { title, ogTitle,  ogDescription, ogImageUrl, favicon } = previewData;
console.log(previewData)
  return (
    <Box as="article" bg="white" borderRadius="lg" overflow="hidden">
      <Flex wrap="wrap">
        <Box w="40%" p={4}>
          {ogImageUrl && <Image src={ogImageUrl} alt={title}  objectFit="cover" />}
        </Box>
        <Box w="60%" p={4}>
          <Heading as="h3" size="md" mb={2}>
            <Link href={url} isExternal target="_blank">
              {ogTitle}
            </Link>
          </Heading>
          <Text color="gray.600">{ogDescription}</Text>
          <Image w={'45px'} mt={2} borderRadius={4} height={'45px'} src={favicon} />
        </Box>
      </Flex>
    </Box>
  );
};

export default LinkPreview;