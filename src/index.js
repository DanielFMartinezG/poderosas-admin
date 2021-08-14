import React from 'react';
import ReactDOM from 'react-dom';
import './styles/global.css';
import App from './components/App'
import fbConfig from './scripts/firebase_config'
import firebase from 'firebase';
import {FirebaseAppProvider} from 'reactfire';
const page_container = document.getElementById('page-container');

firebase.initializeApp(fbConfig);

ReactDOM.render((
  // <FirebaseAppProvider firebaseConfig={fbConfig}>
    <App />
  // </FirebaseAppProvider>
),page_container);