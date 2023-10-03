
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDsrIx6llGt8nd7KtU7HWIrwNUwYxMPP4c",
  authDomain: "chatapp-2c220.firebaseapp.com",
  projectId: "chatapp-2c220",
  storageBucket: "chatapp-2c220.appspot.com",
  messagingSenderId: "1035088001947",
  appId: "1:1035088001947:web:8897fe32b967fc48657f3e",
  measurementId: "G-GN9XNQR2FR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);