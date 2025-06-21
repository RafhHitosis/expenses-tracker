import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBdKDDuysX8HWrqyjF4LNrr95o1qZRDZY0",
  authDomain: "expenses-tracker-bd794.firebaseapp.com",
  projectId: "expenses-tracker-bd794",
  storageBucket: "expenses-tracker-bd794.firebasestorage.app",
  messagingSenderId: "1058254041696",
  appId: "1:1058254041696:web:7b0e70d7c6ee29019e4905",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
