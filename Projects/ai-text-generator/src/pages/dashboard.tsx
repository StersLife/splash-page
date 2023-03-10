import { Box, Button } from '@chakra-ui/react'
import { signOut } from 'firebase/auth'
import React from 'react'
import { auth } from '../lib/firebase'

export const Dashboard = () => {
  return (
    <Box>
      <Button onClick={() => signOut(auth)} >Signout</Button>
    </Box>
  )
}
