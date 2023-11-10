// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAD7q27pfbOLipyCsW5L1IzOGFhXzPUD7s",
  authDomain: "asdd-db7d2.firebaseapp.com",
  projectId: "asdd-db7d2",
  storageBucket: "asdd-db7d2.appspot.com",
  messagingSenderId: "530440033366",
  appId: "1:530440033366:web:441233cc7053fd846f17f7",
  measurementId: "G-4YG4T7RRMY"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
