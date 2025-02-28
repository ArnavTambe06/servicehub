import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDoAIL3AXitL-FFcqg6DsFH4SMsJQYsfJY",
    authDomain: "servicehub-3a401.firebaseapp.com",
    databaseURL: "https://servicehub-3a401-default-rtdb.firebaseio.com",
    projectId: "servicehub-3a401",
    storageBucket: "servicehub-3a401.appspot.com",
    messagingSenderId: "171151916922",
    appId: "1:171151916922:web:b280e9194b415e7044e0c3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Add and export GoogleAuthProvider
export const googleProvider = new GoogleAuthProvider();

export default app;
