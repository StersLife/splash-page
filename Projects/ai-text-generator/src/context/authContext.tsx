import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { getOrCreateUser } from '../lib/auth';
import { auth } from '../lib/firebase';

const context = createContext<any>(null);

const AuthContextComponent:FC<any> = ({children}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);


  useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userObject = await getOrCreateUser(user);
          setCurrentUser(userObject)
          // ..
        } else {
          // User is signed out
          console.log("user is logged out")
        }
    });
    return ()  => {
        unsubscribe()
    }
  },  []);
  return (
    <context.Provider value={{
        currentUser,
        setCurrentUser  
    }}>
        {children}
    </context.Provider>
  )
};


const useAuthContext = () =>{
    const ctx = useContext(context);
    if(ctx  === undefined) {
        throw new Error('Please use this hooks inside auth context provider');
    };

    return ctx
}

export {
    AuthContextComponent,
    useAuthContext
}
