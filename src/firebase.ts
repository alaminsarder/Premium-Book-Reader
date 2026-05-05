import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // এটি যোগ করেছেন

const firebaseConfig = {
  apiKey: "AIzaSyD1e4ARQtDVXEdJ6xrjqPiGtJSTQ7bP_SA",
  authDomain: "premiumbookreader.firebaseapp.com",
  projectId: "premiumbookreader",
  storageBucket: "premiumbookreader.firebasestorage.app",
  messagingSenderId: "120629480438",
  appId: "1:120629480438:web:894f850bc9c7c3672f55d7",
  measurementId: "G-JJ4T0LN8XG"
};

const app = initializeApp(firebaseConfig);

// ডাটাবেসটি এক্সপোর্ট করুন
export const db = getFirestore(app);