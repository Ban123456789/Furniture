const firebase = require("firebase/app");
require('dotenv').config();

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASEURL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGE,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIRBASE_MEASUREMENTID,
  };

  firebase.initializeApp(firebaseConfig);

  module.exports = firebase;