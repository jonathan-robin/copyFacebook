import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';

const app = firebase.initializeApp({
    apiKey: 'AIzaSyDkqffnPiir8n24hjwpXk9J3_SJEA4C9dk',
    authDomain: 'copiefacebook.firebaseapp.com',
    databaseURL: "https://copiefacebook-default-rtdb.firebaseio.com",
    projectId: 'copiefacebook',
    storageBucket:'copiefacebook.appspot.com',
    messagingSenderId: '239055548200',
    appId: '1:239055548200:web:28bfb5c8cbccc84e716a1d'
})

export const auth = app.auth()
export const db = app.firestore();
export const storage = app.storage(); 
export default app