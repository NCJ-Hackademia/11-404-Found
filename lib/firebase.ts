// Firebase configuration and initialization
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth"
import { getStorage } from "firebase/storage"

// Firebase configuration - using the provided config
const firebaseConfig = {
  apiKey: "AIzaSyC5kDT0rOKghoRgD3Nvx1bSiGhY5R0-nrE",
  authDomain: "trustlist-6b29d.firebaseapp.com",
  projectId: "trustlist-6b29d",
  storageBucket: "trustlist-6b29d.firebasestorage.app",
  messagingSenderId: "566222937814",
  appId: "1:566222937814:web:2b6b8a37cace76aedef377",
  measurementId: "G-BQ2ZP31QW7"
}

// Initialize Firebase (singleton pattern for SSR/Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Firebase Storage
export const storage = getStorage(app)

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider()

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: "select_account"
})

// Export authentication functions
export { signInWithPopup, signOut, onAuthStateChanged }

// Export types
export type { User }

export default app
