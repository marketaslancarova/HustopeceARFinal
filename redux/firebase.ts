// firebase.ts
// firebase.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCH7SWrsZTu7NjhrK1bZCrpyI__kiQUB1A",
  authDomain: "hustopecear.firebaseapp.com",
  projectId: "hustopecear",
  storageBucket: "hustopecear.firebasestorage.app",
  messagingSenderId: "451707972701",
  appId: "1:451707972701:web:acc559406ad720661e31b4"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage }; // přidej `db`
