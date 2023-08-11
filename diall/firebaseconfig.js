// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCNqulX-KvXinbVcQyQ3xXHKdMT0BozIoI",
  authDomain: "diall-22180.firebaseapp.com",
  projectId: "diall-22180",
  storageBucket: "diall-22180.appspot.com",
  messagingSenderId: "251761625616",
  appId: "1:251761625616:web:c0c646c30aca3c1dd55895",
  measurementId: "G-VX6Q7GLTNX"
};
const app=initializeApp(firebaseConfig);
export const storage=getStorage(app)
export const db=getFirestore(app)

