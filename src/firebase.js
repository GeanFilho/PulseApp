// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWaK3m12nybH0A-qKT-RY-_UouMBoNeBc",
  authDomain: "pulse-app-ea663.firebaseapp.com",
  projectId: "pulse-app-ea663",
  storageBucket: "pulse-app-ea663.firebasestorage.app",
  messagingSenderId: "491313789669",
  appId: "1:491313789669:web:24c451023e27d4df5eb20c",

};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };