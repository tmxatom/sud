// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyCC26_n0M1x2nd2QFBxWTkAoF9ndi08-Tk",
  authDomain: "sudinc.firebaseapp.com",
  projectId: "sudinc",
  storageBucket: "sudinc.firebasestorage.app",
  messagingSenderId: "753714604122",
  appId: "1:753714604122:web:bb64b2cd048cc815de5063",
  measurementId: "G-BFVHSKKY54"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle incoming background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);
  
  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: '/firebase-logo.png'
  // };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});