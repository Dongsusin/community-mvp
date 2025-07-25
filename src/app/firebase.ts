import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwg4zmaoa_rKX8FrKdVoarTzqbNF5ZdN4",
  authDomain: "klptest-e5ee7.firebaseapp.com",
  projectId: "klptest-e5ee7",
  storageBucket: "klptest-e5ee7.firebasestorage.app",
  messagingSenderId: "424890573562",
  appId: "1:424890573562:web:803caf488d195527fe9f43",
  measurementId: "G-3PWGB44D20",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
