// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyDf3wHLsxSI68YVWRIaFtOlWDj858UxW_Q",
    authDomain: "application-33867.firebaseapp.com",
    projectId: "application-33867",
    storageBucket: "application-33867.firebasestorage.app",
    messagingSenderId: "614126916352",
    appId: "1:614126916352:web:5e7a8d053f6e45529559e5",
    measurementId: "G-X87YKMJL2D"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore (for contact form)
const db = firebase.firestore();

// Initialize Analytics
const analytics = firebase.analytics();

console.log("🔥 Firebase initialized successfully!");
