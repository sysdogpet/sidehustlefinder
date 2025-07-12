const firebaseConfig = {
  apiKey: "AIzaSyBQQaTNH8RnWOsWaliU6kUt-1uNFp22-Js",
  authDomain: "sidehustlehelper-b8975.firebaseapp.com",
  projectId: "sidehustlehelper-b8975",
  storageBucket: "sidehustlehelper-b8975.appspot.com",   // <- note .appspot.com
  messagingSenderId: "581174934201",
  appId: "1:581174934201:web:ce04ec6be953049404b968"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();
