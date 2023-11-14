// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1n52beNmzhLyqtv29Exw8CIEzde40LOo",
  authDomain: "creekwatchers-88ce2.firebaseapp.com",
  databaseURL: "https://creekwatchers-88ce2-default-rtdb.firebaseio.com",
  projectId: "creekwatchers-88ce2",
  storageBucket: "creekwatchers-88ce2.appspot.com",
  messagingSenderId: "799020915481",
  appId: "1:799020915481:web:e0ac620892635e99760388",
  measurementId: "G-YHS40TRMXG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);