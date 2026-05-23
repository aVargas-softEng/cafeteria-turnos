import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyB-Jm86DQuY8Om8LAtu-emi6j6bO9CMpHk",
  authDomain: "coffeeturns-udc.firebaseapp.com",
  projectId: "coffeeturns-udc",
  storageBucket: "coffeeturns-udc.firebasestorage.app",
  messagingSenderId: "404054899818",
  appId: "1:404054899818:web:046ffe44ef648580359e13"
};

//Inicializacion de Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const messaging = getMessaging(app)
