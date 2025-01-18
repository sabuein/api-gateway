"use strict";

// User roles (visitor, resident, admin).

import { signIn } from "auth";
import { cookieValue, fillTableWithParameters, } from "utils";
import { initializeYouTubeEmbeddedPlayer } from "media";
import { startGame } from "games";
import {
    generateNavMenu,
    renderAccountContent,
    renderDashboardContent,
    fetchAndRenderPosts,
    fetchAndRenderYouTubePlaylists,
} from "interface";
import { importFromFiles } from "importer";
import { registerServiceWorker, requestNotificationsPermission, activeAppInstallButton, populateBluetoothDevices, requestUserAgentHints, processSelection } from "web";
import { initializeTomTomMap } from "tomtom";
import {
    initializePaymentElement,
    returnPaymentElement,
    initializeDonationCard,
} from "stripe";
import { initializeCheckoutResource } from "sumup";
import { initializeFirebaseApp } from "firebaseX";

// When the user logs in
async function handleLogin(username, password) {
    try {
        const response = await signIn(username, password);
        console.log("User signed in:", response);

        localStorage.setItem("jwt", userData.token);
        updateUIOnLogin(userData); // Update UI for logged-in users
    } catch (error) {
        console.error("Login failed:", error);
    }
}

// abuein.renderWhenReady(app);

window.onload = () => {
    populateBluetoothDevices();
    fillTableWithParameters();
    requestUserAgentHints();
    processSelection();
  };
  
// Add click event listener to store active link
document.addEventListener("DOMContentLoaded", async () => {
    // Simulated guest visit
    if (
        !localStorage.getItem("user") ||
        !JSON.parse(localStorage.getItem("user")).isLoggedIn
    ) {
        const guest = {
            isLoggedIn: false,
            role: "guest",
        };
        localStorage.setItem("user", JSON.stringify(guest));
    }

    generateNavMenu();

    switch (window.location.pathname) {

        case "/v1/": {
            activeAppInstallButton();
            requestNotificationsPermission();
            break;
        }
        
        case "/v1/portal": {
            const access = cookieValue("jwtAccess"),
                refresh = cookieValue("jwtRefresh");
            
            console.log("jwtAccess: ", access);
            console.log("jwtRefresh: ", refresh);

            if (access) {
                const user = {
                    isLoggedIn: true,
                    role: "admin",
                };

                localStorage.setItem("user", JSON.stringify(user));
                generateNavMenu();
                renderAccountContent();
            } else
                renderAccountContent();
            break;
        }

        case "/v1/portal/dashboard": {
            document.body.querySelector("main").innerHTML +=
                renderDashboardContent();
            break;
        }

        case "/v1/portal/messaging": {
            initializeFirebaseApp();
            break;
        }

        case "/v1/projects/game": {
            startGame();
            break;
        }

        case "/v1/projects/map": {
            await initializeTomTomMap();
            break;
        }

        case "/v1/feeds/read": {
            await fetchAndRenderPosts();
            break;
        }

        case "/v1/feeds/watch": {
            initializeYouTubeEmbeddedPlayer();
            await fetchAndRenderYouTubePlaylists();
            break;
        }

        case "/v1/money/payment": {
            await initializePaymentElement();
            break;
        }

        case "/v1/money/return": {
            await returnPaymentElement();
            break;
        }

        case "/v1/money/donation": {
            await initializeDonationCard();
            break;
        }

        case "/v1/money/checkout": {
            await initializeCheckoutResource();
            break;
        }
        
        default:
            console.log("Current page path: ", window.location.pathname);
    }
});

window.addEventListener("pageshow", async (event) => {
    await registerServiceWorker();

    if (event.persisted) {
        // Do any checks and updates to the page
        console.log("This page was restored from the bfcache.");
    } else if (event.persisted && !document.cookie.match("/my-cookie")) {
        // Force a reload if the user has logged out.
        location.reload();
    } else {
        console.log("This page was loaded normally.");
    }

    // Open the connection when the page is loaded or restored from bfcache.
    openDB();
});

window.addEventListener("pagehide", (event) => {
    if (event.persisted) {
        console.log("This page *might* be entering the bfcache.");
    } else {
        console.log("This page will unload normally and be discarded.");
    }

    // Close the connection to the database when the user leaves.
    if (dbPromise) {
        dbPromise.then((db) => db.close());
        dbPromise = null;
    }
});

function beforeUnloadListener(event) {
    event.preventDefault();
    return (event.returnValue = "Are you sure you want to exit?");
}

// A function that invokes a callback when the page has unsaved changes.
const onPageHasUnsavedChanges = () => {
    window.addEventListener("beforeunload", beforeUnloadListener);
};

// A function that invokes a callback when the page's unsaved changes are resolved.
const onAllChangesSaved = () => {
    window.removeEventListener("beforeunload", beforeUnloadListener);
};

let dbPromise = null;
const openDB = () => {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const req = indexedDB.open("abuein-db", 1);
            req.onupgradeneeded = () => req.result.createObjectStore("keyval");
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);
        });
    }
    return dbPromise;
};