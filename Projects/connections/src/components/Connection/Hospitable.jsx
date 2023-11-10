import { Box, Button, FormControl, FormLabel, Input, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { db, functions } from './../../firebase/config';
import { httpsCallable } from 'firebase/functions';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';
import  { encrtpyData } from './../../firebase/encryption'
import { fetchAccessToken } from '../../services/hospitableApi';
import { persistImportedProperties } from '../../services/database';
import { importPropertiesFromHospitable } from '../../services/apiService';


export const Hospitable = ({onSuccess}) => {

  const [credentials, setCredentials] = useState({
    clientSecret: 'kRr5PoihPxzaNP84gsLNqnMuQuO0koUQFRly18ol',
    clientId: '9a39f9d2-4f52-44ef-b032-d050ffd5decd'
  });
  const [propertiesState, setPropertiesState] = useState({
    data: null, 
    error: null,
    loading: null
  })

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const {  userData } = useAuth();


  const handleConnect = async () => {

    if(!credentials.clientId || !credentials.clientSecret){
      setError('Please fill all the input fiedls')
      return
    }
    setPropertiesState({
      ...propertiesState,
      loading: true
    })
    try {
    const ref = doc(collection(db, 'connections'));
    let newCredentials = {
      clientId: encrtpyData(credentials.clientId),
      clientSecret: encrtpyData(credentials.clientSecret)
    }
    await setDoc(ref, {
      ...newCredentials,
      id: ref.id,
      apiName: 'Hospitable',
      createdBy: userData.uid
    });
    
    const accessToken = await fetchAccessToken(credentials.clientId, credentials.clientSecret);
    const properties = await importPropertiesFromHospitable(accessToken);

    const propertyIds = properties.data.map((el) => el.id);
 
    const fetchReservations = httpsCallable(functions, 'fetchReservations');
    
    await fetchReservations({
      propertyIds
    });

     await persistImportedProperties({
      ...properties.data,
      connectionId:ref.id 
     })
      // save in the database
      setPropertiesState({
        ...propertiesState,
        data: properties,
        loading: null
      })

    } catch(err) {
      console.log(err);

      setPropertiesState({
        ...propertiesState,
        loading: null,
        error: JSON.stringify(err)
      })
    }






  }

  useEffect(() => {
    if(error) setError(null)
  }, [credentials])

  return (
  <Box mt={4}>
    {
       propertiesState.loading ? (
        <Spinner />
       ) : (
        <>
            <FormControl>
                <FormLabel>Credentials for Hospitable</FormLabel>
                <Input
                  placeholder="API client secret"
                  value={credentials.clientSecret}
                  onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
                />

                <Input
                mt={3}
                  placeholder="API client ID"
                  value={credentials.clientId}
                  onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
                />
                {error && <Text color="red">{error}</Text>}
              </FormControl>
            <Button onClick={handleConnect} colorScheme='red' mt={2}>
              Connect
            </Button>
        </>

       )
    }


  </Box>
  )
}
