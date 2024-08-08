import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/database';

// Your Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDUvw7F48wXGNNJa_NO58Xru8ucWDjuRzc",
  authDomain: "vfit-8e85e.firebaseapp.com",
  databaseURL: "https://vfit-8e85e-default-rtdb.firebaseio.com",
  projectId: "vfit-8e85e",
  storageBucket: "vfit-8e85e.appspot.com",
  messagingSenderId: "185468595314",
  appId: "1:185468595314:web:50ac7436877a2f716c66eb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
