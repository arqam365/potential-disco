import { initializeApp } from "firebase/app"
import { initializeFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyB5tvflk2WFoI4PGncZWrEOmyakaFQBTYE",
    authDomain: "packagefy.firebaseapp.com",
    projectId: "packagefy",
    storageBucket: "packagefy.appspot.com",
    messagingSenderId: "292607266314",
    appId: "1:292607266314:web:3a79993585ad75d8a12573",
}

const app = initializeApp(firebaseConfig)
const db = initializeFirestore(app, {})

const firebaseServices = { app, db }
export default firebaseServices
