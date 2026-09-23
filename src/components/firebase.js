import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBEC-GaBm52t3nuREsSWUTzpHnK05bY9YI",
  authDomain: "gastitos-ec4e3.firebaseapp.com",
  projectId: "gastitos-ec4e3",
  storageBucket: "gastitos-ec4e3.firebasestorage.app",
  messagingSenderId: "80226396434",
  appId: "1:80226396434:web:62bdbcc0ca85f70046ebcb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
