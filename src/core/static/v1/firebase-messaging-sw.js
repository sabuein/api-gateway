"use strict";

/** Import and configure the Firebase SDK to initialize Firebase Messaging in the Service Worker when your app is not hosted on Firebase Hosting. Give the service worker access to Firebase Messaging. Note that you can only use Firebase Messaging here. Other Firebase libraries are not available in the service worker. See https://firebase.google.com/docs/web/setup. */
self.importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

/** Initialize the Firebase app in the service worker by passing in your app's Firebase config object. See: https://firebase.google.com/docs/web/setup#config-object. */
const initializeFirebaseApp = () => {
    const app = firebase.initializeApp({
        apiKey: "api-key",
        authDomain: "project-id.firebaseapp.com",
        databaseURL: "https://project-id.firebaseio.com",
        projectId: "project-id",
        storageBucket: "project-id.appspot.com",
        messagingSenderId: "sender-id",
        appId: "app-id",
        measurementId: "G-measurement-id",
    });

    // Retrieve an instance of Firebase Messaging so that it can handle background messages.
    const messaging = firebase.messaging();

    // If you would like to customize notifications that are received in the
    // background (Web app is closed or not in browser focus) then you should
    // implement this optional method.
    // Keep in mind that FCM will still show notification messages automatically
    // and you should use data messages for custom notifications.
    // For more info see:
    // https://firebase.google.com/docs/cloud-messaging/concept-options
    messaging.onBackgroundMessage((payload) => {
        console.log(
            "[firebase-messaging-sw.js] Received background message ",
            payload
        );

        // Customize notification here
        const notificationTitle = "Background Message Title";
        const notificationOptions = {
            body: "Background Message body.",
            icon: "/firebase-logo.png",
            click_action: window.location
        };

        self.registration.showNotification(
            notificationTitle,
            notificationOptions
        );
    });
};

initializeFirebaseApp();