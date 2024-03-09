// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7ufjhfgYhNH1EVgHCR2xF3WRHQuwq8_s",
  authDomain: "simple-chat-app-c9b71.firebaseapp.com",
  projectId: "simple-chat-app-c9b71",
  storageBucket: "simple-chat-app-c9b71.appspot.com",
  messagingSenderId: "897201066712",
  appId: "1:897201066712:web:8393ea8a45709d7e477dad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default { firebaseConfig, database };
