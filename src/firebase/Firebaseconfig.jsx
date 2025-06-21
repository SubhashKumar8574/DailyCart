// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCv7L8btXViwzxw2UYEZ0_3XCgvsdOSIaU",
    authDomain: "dailycart-e84eb.firebaseapp.com",
    projectId: "dailycart-e84eb",
    storageBucket: "dailycart-e84eb.firebasestorage.app",
    messagingSenderId: "136889293370",
    appId: "1:136889293370:web:7aeb3e20620ba714423303"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);

export {fireDB,auth}; 