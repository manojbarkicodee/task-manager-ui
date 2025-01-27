// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// // import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCFlaNCJIldNFFatable13m_0ed-MIgesc",
//   authDomain: "task-manager-e9534.firebaseapp.com",
//   projectId: "task-manager-e9534",
//   storageBucket: "task-manager-e9534.firebasestorage.app",
//   messagingSenderId: "1037464558396",
//   appId: "1:1037464558396:web:acc9987358c85a4aca9c39",
//   measurementId: "G-G2KF6CF9H6"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore for tasks

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFlaNCJIldNFFatable13m_0ed-MIgesc",
  authDomain: "task-manager-e9534.firebaseapp.com",
  projectId: "task-manager-e9534",
  storageBucket: "task-manager-e9534.appspot.com", // Corrected the storage bucket name
  messagingSenderId: "1037464558396",
  appId: "1:1037464558396:web:acc9987358c85a4aca9c39",
  measurementId: "G-G2KF6CF9H6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Firebase Authentication
export const db = getFirestore(app); // Firestore Database
