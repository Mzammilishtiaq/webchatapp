// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC1QtweUsxPWLQYaRXLby_S7LiWwp57o_4',
  authDomain: "client-chat-b078f.firebaseapp.com",
  databaseURL: "https://client-chat-b078f-default-rtdb.firebaseio.com",
  projectId: "client-chat-b078f",
  storageBucket: "client-chat-b078f.appspot.com",
  messagingSenderId: "547977174443",
  appId: "1:547977174443:web:dff1a3d7354654968906ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const getauth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app)
