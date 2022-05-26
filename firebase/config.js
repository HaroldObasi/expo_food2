import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_mSMOzn8QHcdujx7tTJLpyj0bGspeuzY",
  authDomain: "react-firebase-8a28c.firebaseapp.com",
  projectId: "react-firebase-8a28c",
  storageBucket: "react-firebase-8a28c.appspot.com",
  messagingSenderId: "400606158225",
  appId: "1:400606158225:web:60539a6c808ea081744e30",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
