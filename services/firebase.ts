
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9dJAyiVilxlyr_KJX1lw1kH_exFzheas",
  authDomain: "rateguard-a46d6.firebaseapp.com",
  projectId: "rateguard-a46d6",
  storageBucket: "rateguard-a46d6.firebasestorage.app",
  messagingSenderId: "43714758111",
  appId: "1:43714758111:web:7da588fc55838b0921306a",
  measurementId: "G-4ZPQ4H5M2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics safely
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(err => {
    console.warn("Firebase Analytics not supported in this environment:", err);
  });
}

export { analytics };

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();

// Re-exports for authentication logic
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
