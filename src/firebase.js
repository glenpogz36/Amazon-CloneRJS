
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6cnIU7hKz9JvB96U71W6dt5okgfvSzDY",
    authDomain: "rjs-79a20.firebaseapp.com",
    databaseURL: "https://rjs-79a20-default-rtdb.firebaseio.com",
    projectId: "rjs-79a20",
    storageBucket: "rjs-79a20.appspot.com",
    messagingSenderId: "303044726951",
    appId: "1:303044726951:web:e4f330dea15650bf188b82",
    measurementId: "G-WY1J5FBPDJ"
};

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const db = getFirestore(firebaseApp);
const auth = getAuth();

export { db, auth };
