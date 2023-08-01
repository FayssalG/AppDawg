import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyDEnQ8ODzuxPQNKDKzGtww6g0IZl9O9Z80",
    authDomain: "chatapp-1b6a1.firebaseapp.com",
    projectId: "chatapp-1b6a1",
    storageBucket: "chatapp-1b6a1.appspot.com",
    messagingSenderId: "884664074",
    appId: "1:884664074:web:14555d68d14b2ab4293cf3",
    databaseURL: "https://chatapp-1b6a1-default-rtdb.europe-west1.firebasedatabase.app"
};

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)
