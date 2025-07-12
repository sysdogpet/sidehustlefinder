const firebaseConfig = {
  apiKey: "AIzaSyA8aO4qkO_Jb7N_____REAL_KEY_____g",
  authDomain: "sidehustlefinder.firebaseapp.com",
  projectId: "sidehustlefinder",
  storageBucket: "sidehustlefinder.appspot.com",
  messagingSenderId: "709531234567",
  appId: "1:709531234567:web:1a2b3c4d5e6f7g8h9i"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();
