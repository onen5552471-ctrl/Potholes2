import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { db } from "../firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBRh-CGTPNYyRKKal87QRucG9pCp8cVDcM",
  authDomain: "pothole-6b684.firebaseapp.com",
  projectId: "pothole-6b684",
  storageBucket: "pothole-6b684.firebasestorage.app",
  messagingSenderId: "711077283246",
  appId: "1:711077283246:web:c6147d5e3f0d0f5add343f",
  measurementId: "G-15E94WM26F"
};

const app = initializeApp(firebaseConfig);

// ✅ Firestore (THIS is what saves data)
const db = getFirestore(app);

// ✅ Safe analytics
let analytics;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});

export { db };