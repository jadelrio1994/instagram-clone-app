import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB6nJ-1gorsXij-dQDLW4vtYUOKivveeAo",
  authDomain: "instagram-clone-app-77dc9.firebaseapp.com",
  projectId: "instagram-clone-app-77dc9",
  storageBucket: "instagram-clone-app-77dc9.appspot.com",
  messagingSenderId: "728653034180",
  appId: "1:728653034180:web:023dc51e5170ab1248cf91",
  measurementId: "G-S28X15YCT0",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
