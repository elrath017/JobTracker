import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyChgIplaH3unUvrugbHwjSNGxbEaNuj27k",
  authDomain: "jobtracker-5caf6.firebaseapp.com",
  databaseURL: "https://jobtracker-5caf6-default-rtdb.firebaseio.com",
  projectId: "jobtracker-5caf6",
  storageBucket: "jobtracker-5caf6.appspot.com",
  messagingSenderId: "73553516904",
  appId: "1:73553516904:web:cdce46b98cdd52a9a15edd"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const database = firebase.database();
export default firebase;
