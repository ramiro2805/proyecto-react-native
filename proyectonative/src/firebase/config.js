
import app from 'firebase/app'
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAX9LQZlXsIIewFSz_YqW1HLq95jyqRJM0",
    authDomain: "proyecto-native-2960d.firebaseapp.com",
    projectId: "proyecto-native-2960d",
    storageBucket: "proyecto-native-2960d.appspot.com",
    messagingSenderId: "443674079891",
    appId: "1:443674079891:web:397c63f2b47774636d9366"
  };

  app.initializeApp(firebaseConfig)

  export const auth = firebase.auth()
  export const db = app.firestore()
  export const storage = app.storage()

