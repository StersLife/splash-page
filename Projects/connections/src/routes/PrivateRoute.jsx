import { Spinner } from '@chakra-ui/react'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase/config'

export const ProtectedRoutes = ({children}) => {
    const [loading, setLoading] = useState(true)
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if(user) {
                 setIsUserAuthenticated(true);
                 setLoading(false)
            } else {
                setIsUserAuthenticated(false);
                setLoading(false)

            }
        })
    }, [])
    if(!loading && !isUserAuthenticated) {
        window.location.href = '/login'
    }
    if(loading) {
        return <Spinner mx={'auto'} mt={'50px'} />
    }

 
  return  children
}
