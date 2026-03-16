import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBPuG6mh0W6a_avtmfQYi7oGww7wMazdh4",
  authDomain: "blindranking-6e66b.firebaseapp.com",
  databaseURL: "https://blindranking-6e66b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "blindranking-6e66b",
  storageBucket: "blindranking-6e66b.firebasestorage.app",
  messagingSenderId: "528194201297",
  appId: "1:528194201297:web:b4142c4a8dced76c2b07f0"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);