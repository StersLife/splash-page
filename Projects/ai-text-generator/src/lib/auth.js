import{ doc, getDoc, setDoc}  from 'firebase/firestore'
import { db } from './firebase';


export const getOrCreateUser = async  (firebaseUser, userCredentials  =  {}) =>  {
    let userObject = {
            fullName: userCredentials.fullName || firebaseUser.displayName,
            email: userCredentials.email || firebaseUser.email,
            phoneNumber: userCredentials.phoneNumber || ''
        }
    const  ref = doc(db, 'users',  firebaseUser.uid);
    const snapshot = await getDoc(ref);

    if(!snapshot.exists()) {
        await setDoc(ref, {
            ...userObject,
            id: ref.id
        })
    }  else {
        return  snapshot.data()
    }



}