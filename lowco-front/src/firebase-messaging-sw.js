importScripts(
    "https://www.gstatic.com/firebasejs/9.7.0/firebase-app-compat.js",
);
importScripts(
    "https://www.gstatic.com/firebasejs/9.7.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
    apiKey: "AIzaSyBGaez8mdwUz9zWelkQcKD1c4qGmnVukvg",
    authDomain: "lowco2.firebaseapp.com",
    projectId: "lowco2",
    storageBucket: "lowco2.appspot.com",
    messagingSenderId: "825860913033",
    appId: "1:825860913033:web:71a31b6defca8401cd5358",
});
const messaging = firebase.messaging();