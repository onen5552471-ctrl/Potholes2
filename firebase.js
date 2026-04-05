// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRh-CGTPNYyRKKal87QRucG9pCp8cVDcM",
  authDomain: "pothole-6b684.firebaseapp.com",
  projectId: "pothole-6b684",
  storageBucket: "pothole-6b684.firebasestorage.app",
  messagingSenderId: "711077283246",
  appId: "1:711077283246:web:c6147d5e3f0d0f5add343f",
  measurementId: "G-15E94WM26F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);