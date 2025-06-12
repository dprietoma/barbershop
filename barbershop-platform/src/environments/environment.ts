// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDYmcXxaufXjCwBkUHttg1GTJWjHbU9KqQ",
    authDomain: "barbershop-1e2aa.firebaseapp.com",
    projectId: "barbershop-1e2aa",
    storageBucket: "barbershop-1e2aa.firebasestorage.app",
    messagingSenderId: "694027883441",
    appId: "1:694027883441:web:96bed2d4beb6f008cce390",
    measurementId: "G-HV9YRNHXF5"
  }
};

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);