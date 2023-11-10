import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDoc, getFirestore, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user data based on UID and store it in state
        fetchUserData(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (userDocSnapshot.exists()) {
        setUserData(userDocSnapshot.data());
      } else {
        console.error('User document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const value = {
    currentUser,
    userData,
  };
  console.log(value)

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};