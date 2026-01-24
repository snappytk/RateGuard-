
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9dJAyiVilxlyr_KJX1lw1kH_exFzheas",
  authDomain: "rateguard-a46d6.firebaseapp.com",
  projectId: "rateguard-a46d6",
  storageBucket: "rateguard-a46d6.firebasestorage.app",
  messagingSenderId: "43714758111",
  appId: "1:43714758111:web:7da588fc55838b0921306a",
  measurementId: "G-4ZPQ4H5M2Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider
};

export type { User };
