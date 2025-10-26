// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBdws8KjeaiLeBT1ZpBXepoYaEWvo3hUpA",
    authDomain: "prepbuddy-4418b.firebaseapp.com",
    projectId: "prepbuddy-4418b",
    storageBucket: "prepbuddy-4418b.firebasestorage.app",
    messagingSenderId: "85429379109",
    appId: "1:85429379109:web:d1e3187ce391f4d8531fcc",
    measurementId: "G-09Y03NL58Q"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

