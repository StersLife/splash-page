import {  doc,  collection, setDoc } from "firebase/firestore"; 
import { db  } from './../firebase/config'

export const persistImportedProperties = async  (properties = []) => {

    const promise = [];


   properties.forEach((property) => {
        let newDocRef =  doc(collection(db , 'properties')); // Create a new document reference
        promise.push(setDoc(newDocRef, {
            ...property,
            settings: {
                forwardGuides: false,
                autoDelete: true,
                reservationAutoSync: false
            },
            fid: newDocRef.id
        }))
    });

    const response = await Promise.all(promise)

}