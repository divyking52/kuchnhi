
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDm5dkaFpu1I21ABus9_KujneRRD7BPvYo" ,
  authDomain: "reactchat-94695.firebaseapp.com",
  projectId: "reactchat-94695",
  storageBucket: "reactchat-94695.appspot.com",
  messagingSenderId: "776641526294",
  appId: "1:776641526294:web:bba5ea09cd9a971e60d337"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore() 
export const storage = getStorage() 