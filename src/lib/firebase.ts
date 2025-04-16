import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAOE02LUyPe9hzbzA6gfnYDysA2ar8VLsw",
  authDomain: "mehkova-86944.firebaseapp.com",
  projectId: "mehkova-86944",
  storageBucket: "mehkova-86944.appspot.com",
  messagingSenderId: "596325574453",
  appId: "1:596325574453:web:701f70b5b500c8aaa90e7c",
  measurementId: "G-5FPF9H68E5"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  if (typeof window !== 'undefined') {
    console.log('Firebase initialized successfully');
  }
} catch (error) {
  console.error('Firebase initialization error', error);
  throw new Error('Failed to initialize Firebase services');
}

export { auth, db };