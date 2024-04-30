import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import * as firebaseui from 'firebaseui'; // Import all named exports


const LoginPage = () => {
  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());

    const uiConfig = {
      signInSuccessUrl: '/', // Redirect URL after successful login
      signInOptions: [
        firebase.auth.OAuthProvider('microsoft.com'),
      ],
      signInFlow: 'popup',
    };

    ui.start('#firebaseui-auth-container', uiConfig);

    return () => {
      ui.delete(); // Clean up FirebaseUI instance
    };
  }, []);

  return (
    <div>
      <h1>Login Page</h1>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default LoginPage;
