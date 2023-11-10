import { db } from './config';

import { doc, getDoc, setDoc } from 'firebase/firestore';

import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();


export const gmailAuth = async () => {
  const auth = getAuth();
  const result = await signInWithPopup(auth, provider);
  // This gives you a Google Access Token. You can use it to access the Google API.
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  // The signed-in user info.
  const user = result.user;
  await getOrCreateUser(user);
};


export const getOrCreateUser = async (userCredential) => {
  console.log(userCredential);
  try {
    // Check if the user already exists in Firestore
    const userRef = doc(db, 'users', userCredential.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // User already exists in Firestore, return the user data
      return userDoc.data();
    }

    // Set additional user data in Firestore
    const newUser = {
      displayName: userCredential.displayName || '',
      email: userCredential.email || '',
      uid: userCredential.uid,
    };
    await setDoc(userRef, newUser);

    return newUser;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw error;
  }
};

export const emailAndPasswordSignup = async (email, password) => {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await getOrCreateUser(userCredential.user);
  return userCredential.user;
};


export const emailAndPasswordSignin = async (email, password) => {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};