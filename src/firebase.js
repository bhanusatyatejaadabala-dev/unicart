import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration loaded from environment variables
// See .env.example for required variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate that required config is present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase configuration is missing. " +
    "Please create a .env file based on .env.example with your Firebase credentials."
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
