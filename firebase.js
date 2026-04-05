import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "pothole-6b684.firebaseapp.com",
  projectId: "pothole-6b684",
  storageBucket: "pothole-6b684.appspot.com",
  messagingSenderId: "711077283246",
  appId: "1:711077283246:web:...",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);