// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // import auth functions
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Database import

const firebaseConfig = {
  apiKey: "AIzaSyCkRaY8gpWyW0lsoPSMLhBUL6XjoFeotBU",
  authDomain: "skilltree-dc7eb.firebaseapp.com",
  projectId: "skilltree-dc7eb",
  storageBucket: "skilltree-dc7eb.appspot.com",
  messagingSenderId: "600908959222",
  appId: "1:600908959222:web:836d66adc87fa95eb54bd7",
  measurementId: "G-RK9CRJ97HS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Authentication and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);  // Database