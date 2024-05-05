import React, { useState } from 'react';
import { Input, Box, Text } from '@chakra-ui/react';

function Upload({ onFileUpload }) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const fileKey  = Object.keys(event.target.files);

     const files = fileKey.map((key) => event.target.files[key] )
    setSelectedFiles(files); // Spread operator to create a new array
    onFileUpload(files); // Pass all selected files to the callback
  };
  return (
    <Box>
      <Input type="file" multiple   onChange={handleFileChange} />
      {selectedFiles.length > 0 && (
  <Box mt={2}>
    <Text>Selected Files:</Text>
    <ul>
      {selectedFiles.map((file, index) => (
        <li key={index}>{file.name}</li>
      ))}
    </ul>
  </Box>
)}
    </Box>
  );
}

export default Upload;