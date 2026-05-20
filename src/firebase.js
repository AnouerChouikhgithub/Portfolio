// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7FXaU6vpLgQpY9a3aqb2wZ7yYziw13PM",
  authDomain: "anouer-portfolio.firebaseapp.com",
  projectId: "anouer-portfolio",
  storageBucket: "anouer-portfolio.firebasestorage.app",
  messagingSenderId: "910344252088",
  appId: "1:910344252088:web:224b3cb0d8af434084224d",
  measurementId: "G-JXWMZH14EY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);