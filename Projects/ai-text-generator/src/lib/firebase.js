// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwC73drmdcqpPLFzRuxbSPuUBFz54AXz4",
  authDomain: "listbnb.firebaseapp.com",
  projectId: "listbnb",
  storageBucket: "listbnb.appspot.com",
  messagingSenderId: "1052086973332",
  appId: "1:1052086973332:web:abc5c2ac8a251de0c55581",
  measurementId: "G-B5HJPT9QPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
export default app;