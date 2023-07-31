import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyDEnQ8ODzuxPQNKDKzGtww6g0IZl9O9Z80",
    authDomain: "chatapp-1b6a1.firebaseapp.com",
    projectId: "chatapp-1b6a1",
    storageBucket: "chatapp-1b6a1.appspot.com",
    messagingSenderId: "884664074",
    appId: "1:884664074:web:14555d68d14b2ab4293cf3"
};

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
