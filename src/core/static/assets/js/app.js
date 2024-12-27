"use strict";

// User roles (visitor, resident, admin).

import apiCall from "./modules/apiService.js";
import { signIn } from "./modules/authService.js";
import { cookieValue } from "./modules/utils.js";
import { startGame } from "./modules/gameService.js";
import {
  generateNavMenu,
  renderAccountContent,
  renderDashboardContent,
} from "./modules/interface.js";
import { importFromFiles } from "./modules/importer.js";

// When the user logs in
async function handleLogin(username, password) {
  try {
    const response = await signIn(username, password);
    console.log("User signed in:", response);

    localStorage.setItem('jwt', userData.token);
    updateUIOnLogin(userData); // Update UI for logged-in users

  } catch (error) {
    console.error("Login failed:", error);
  }
}

// Fetch content for a specific page
async function fetchPageContent(pageId) {
  try {
    const data = await apiCall(`pages/${pageId}`, "GET");
    console.log("Page content:", data);
  } catch (error) {
    console.error("Failed to fetch page content:", error);
  }
}

// Fetch user dashboard
async function fetchUserDashboard(pageId) {
  try {
    const data = await apiCall(`dashboard`, "GET");
    renderDashboard(data);
  } catch (error) {
    console.error("Failed to fetch page content:", error);
  }
}

// abuein.renderWhenReady(app);

// Add click event listener to store active link
document.addEventListener("DOMContentLoaded", () => {

  // Simulated guest visit
  if (!localStorage.getItem("user") || !JSON.parse(localStorage.getItem("user")).isLoggedIn) {
    const guest = {
      isLoggedIn: false,
      role: "guest"
    };
    localStorage.setItem("user", JSON.stringify(guest));
  }

  generateNavMenu();

  switch (window.location.pathname) {
    case "/portal":
      document.body.querySelector("main").innerHTML += renderAccountContent();
      break;

    case "/portal/dashboard":
      const access = cookieValue("access");
      if (access) {
        const user = {
          isLoggedIn: true,
          role: "admin"
        };

        localStorage.setItem("user", JSON.stringify(user));
        generateNavMenu();
      }
      document.body.querySelector("main").innerHTML += renderDashboardContent();
      console.log("Helloooooo");
      
      break;

    case "/services/game":
      startGame();
      break;
    
    default:
      console.log("Current page path: ", window.location.pathname);
      break;
  }
});

window.addEventListener("pageshow", (event) => {


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

  if (event.persisted) {
    // Do any checks and updates to the page
    console.log('This page was restored from the bfcache.');
  } else if (event.persisted && !document.cookie.match("/my-cookie")) {
    // Force a reload if the user has logged out.
    location.reload();
  }
  else {
    console.log('This page was loaded normally.');
  }

  // Open the connection when the page is loaded or restored from bfcache.
  openDB();
});

window.addEventListener('pagehide', (event) => {
  if (event.persisted) {
    console.log('This page *might* be entering the bfcache.');
  } else {
    console.log('This page will unload normally and be discarded.');
  }

  // Close the connection to the database when the user leaves.
  if (dbPromise) {
    dbPromise.then(db => db.close());
    dbPromise = null;
  }
});

function beforeUnloadListener(event) {
  event.preventDefault();
  return event.returnValue = 'Are you sure you want to exit?';
};

// A function that invokes a callback when the page has unsaved changes.
const onPageHasUnsavedChanges = () => {
  window.addEventListener('beforeunload', beforeUnloadListener);
};

// A function that invokes a callback when the page's unsaved changes are resolved.
const onAllChangesSaved = () => {
  window.removeEventListener('beforeunload', beforeUnloadListener);
};

let dbPromise;
function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open('my-db', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('keyval');
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  }
  return dbPromise;
}