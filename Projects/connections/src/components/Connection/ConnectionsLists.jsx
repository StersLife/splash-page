
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Text } from '@chakra-ui/react';

export const ConnectionsLists = () => {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const connectionsRef = collection(db, 'connections');
      const q = query(connectionsRef, where('createdBy', '==', currentUser.uid));

      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(q);
          const connectionsData = [];

          querySnapshot.forEach((doc) => {
            connectionsData.push({ id: doc.id, ...doc.data() });
          });

          setConnections(connectionsData);
        } catch (error) {
          console.error('Error fetching connections:', error);
        }
      };

      fetchData();
    }
  }, [currentUser, db]);

  return (
    <Box p={3} >
      <h2>Your Connections</h2>
      <Accordion allowToggle={true}>
 
        {connections.map((connection) => (
           <AccordionItem>
           <h2>
             <AccordionButton>
               <Box as="span" flex='1' textAlign='left'>
               Connection Name: {connection.apiName} && ID: {connection.id}
               </Box>
               <AccordionIcon />
             </AccordionButton>
           </h2>
           <AccordionPanel pb={4}>
              <Text>Imported properties hbe</Text>
           </AccordionPanel>
         </AccordionItem>
       

        ))}
</Accordion>

    </Box>
  );

}
