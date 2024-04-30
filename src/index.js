// index.js or App.js
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/compat/app'; // Updated import statement
import 'firebase/compat/database'; // Updated import statement
import 'firebase/compat/storage'; // Updated import statement
import UploadDetails from './pages/UploadDetails';
import App from './App';





const firebaseConfig = {
  apiKey: "AIzaSyAAd7X6yf-fayxQ3rPLiYvrgr2sgd8dkXA",
  authDomain: "virtuafit-aef64.firebaseapp.com",
  databaseURL: "https://virtuafit-aef64-default-rtdb.firebaseio.com",
  projectId: "virtuafit-aef64",
  storageBucket: "virtuafit-aef64.appspot.com",
  messagingSenderId: "1037219375280",
  appId: "1:1037219375280:web:a0141bdf87899b896cf375"
};

firebase.initializeApp(firebaseConfig); // Initialize Firebase

ReactDOM.render(
    <React.StrictMode>
        {/* <UploadDetails /> */}
    {/* <UploadDetails /> */}

    <App />
    </React.StrictMode>,
    document.getElementById('root')
);
