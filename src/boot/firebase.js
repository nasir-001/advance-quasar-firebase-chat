import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_ID",
  appId: "YOUR_FIREBASE_APP_ID",
  measurementId: "YOUR_FIREBASE_MEARSUREMENT_IF",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const realtimeDb = getDatabase(app);
const storage = getStorage(app);
const firestoreDb = getFirestore();

export { firestoreDb, realtimeDb, storage, analytics };
