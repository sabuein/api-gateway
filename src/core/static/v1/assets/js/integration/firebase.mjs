"use strict";
// Import the functions you need from the SDKs you need
// import { admin } from "firebase-admin";
import {} from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// Follow this pattern to import other Firebase services
// import { } from "firebase/<service>";
import {} from "firebase/messaging";
import apiCall from "service";
import { addMessage } from "interface";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/** Load Vapid's public key from the server. */
const loadVapidPublicKey = async () => await apiCall({
    endpoint: "config/vapid",
    method: "POST",
});

/** Load Firebase's public key from the server. */
const loadFirebaseConfig = async () => await apiCall({
    endpoint: "config/firebase",
    method: "POST",
});

const loadServiceAccountKey = async () => await apiCall({
    endpoint: "config/firebase/admin",
    method: "POST",
});

/** Initialize Firebase admin. */
const initializeFirebaseAdmin = async () => {
    try {
        const { key } = await loadServiceAccountKey();
        if (!key) addMessage( "No key returned from the server for Firebase Admin. Please check and try again.");
        return await admin.initializeApp({ credential: admin.credential.cert(window.atob(key)) });

    } catch (error) {
        console.error("Couldn't initialize Firebase admin.");
    }
};

/** Initialize Firebase app, and Firebase Cloud Messaging & Analytics services. */
const initializeFirebaseApp = async () => {
    try {
        const { firebaseConfig } = await loadFirebaseConfig();
        if (!firebaseConfig)
            addMessage(
                "No API public key returned from the server. Please check and try again."
            );

        // Initialize Firebase app
        const app = firebase.initializeApp(atob(firebaseConfig));
        // Initialize Firebase Cloud Messaging and get a reference to the service
        // Get registration token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        // const messaging = getMessaging(app);
        // const analytics = getAnalytics(app);

        const messaging = firebase.messaging();

        // IDs of divs that display registration token UI or request permission UI.
        const tokenDivId = "token_div";
        const permissionDivId = "permission_div";

        // Handle incoming messages. Called when:
        // - a message is received while the app has focus
        // - the user clicks on an app notification created by a service worker
        //   `messaging.onBackgroundMessage` handler.
        messaging.onMessage(messaging, (payload) => {
            console.log("Message received. ", payload);
            // Update the UI to include the received message.
            appendMessage(payload);
        });

        document
            .getElementById("request-permission-button")
            .addEventListener("click", requestPermission);
        document
            .getElementById("delete-token-button")
            .addEventListener("click", () =>
                deleteTokenFromFirebase(messaging)
            );

        resetUI();
    } catch (error) {
        console.error("Couldn't initialize Firebase app.");
    }
};

/** Get registration token. Initially this makes a network call, once retrieved subsequent calls to getToken will return from cache. */
const resetUI = async () => {
    clearMessages();
    showToken("Loading...");

    try {
        const { apiKey } = await loadVapidPublicKey();
        if (!apiKey)
            addMessage(
                "No API public key returned from the server. Please check and try again."
            );

        const currentToken = await getToken(messaging, atob(apiKey));
        if (currentToken) {
            // Send the token to your server and update the UI if necessary.
            sendTokenToServer(currentToken);
            updateUIForPushEnabled(currentToken);
            console.log("Registration token is available.", currentToken);
        } else {
            // Show permission request UI.
            updateUIForPushPermissionRequired();
            setTokenSentToServer(false);
            console.log(
                "No registration token available. Request permission to generate one."
            );
        }
    } catch (error) {
        console.log("An error occurred while retrieving token.", error);
        showToken("Error retrieving registration token.");
        setTokenSentToServer(false);
    }
};

const showToken = (currentToken) => {
    // Show token in console and UI.
    const tokenElement = document.querySelector("#token");
    tokenElement.textContent = currentToken;
};

// Send the registration token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
const sendTokenToServer = (currentToken) => {
    if (!isTokenSentToServer()) {
        console.log("Sending token to server...", currentToken);
        // TODO(developer): Send the current token to your server.
        setTokenSentToServer(true);
    } else {
        console.log(
            "Token already sent to server so won't send it again unless it changes"
        );
    }
};

const isTokenSentToServer = () =>
    window.localStorage.getItem("sentToServer") === "1";
const setTokenSentToServer = (sent) =>
    window.localStorage.setItem("sentToServer", sent ? "1" : "0");

const showHideDiv = (divId, show) => {
    const div = document.querySelector("#" + divId);
    if (show) {
        div.style.display = "block";
    } else {
        div.style.display = "none";
    }
};

const requestPermission = () => {
    console.log("Requesting permission...");
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification permission granted.");
            // TODO(developer): Retrieve a registration token for use with FCM.
            // In many cases once an app has been granted notification permission,
            // it should update its UI reflecting this.
            resetUI();
        } else {
            console.log("Unable to get permission to notify.");
        }
    });
};

const deleteTokenFromFirebase = (messaging) => {
    // Delete registration token.
    getToken(messaging)
        .then((currentToken) => {
            deleteToken(messaging)
                .then(() => {
                    console.log("Token deleted.", currentToken);
                    setTokenSentToServer(false);
                    // Once token is deleted update UI.
                    resetUI();
                })
                .catch((err) => {
                    console.log("Unable to delete token. ", err);
                });
        })
        .catch((err) => {
            console.log("Error retrieving registration token. ", err);
            showToken("Error retrieving registration token.");
        });
};

// Add a message to the messages element.
const appendMessage = (payload) => {
    const messagesElement = document.querySelector("#messages");
    const dataHeaderElement = document.createElement("h5");
    const dataElement = document.createElement("pre");
    dataElement.style.overflowX = "hidden;";
    dataHeaderElement.textContent = "Received message:";
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderElement);
    messagesElement.appendChild(dataElement);
};

// Clear the messages element of all children.
const clearMessages = () => {
    const messagesElement = document.querySelector("#messages");
    while (messagesElement.hasChildNodes()) {
        messagesElement.removeChild(messagesElement.lastChild);
    }
};

const updateUIForPushEnabled = (currentToken) => {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
};

const updateUIForPushPermissionRequired = () => {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
};

export { initializeFirebaseApp };