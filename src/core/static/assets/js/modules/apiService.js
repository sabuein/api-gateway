"use strict";

// apiService.mjs
const API_BASE_URL = "https://dummyjson.com";

// Utility to get the token from storage
function getToken() {
    return localStorage.getItem("jwtToken");
}

// Central API call function
async function apiCall(endpoint, method = "GET", body = null, auth = null) {
    const headers = {
        "Content-Type": "application/json",
    };

    if (!!auth) {
        headers.Authorization = `Bearer ${getToken()}`; // Attach JWT token
    }

    const options = {
        method,
        headers,
    };

    if (!!auth) {
        options.credentials = "include"; // Include cookies (e.g., accessToken) in the request
    }

    if (!!body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);

        // Handle potential errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // On a 401 Unauthorized response, fetch a new token and retry the request.

        // Return JSON response
        return await response.json();
    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
}

export default apiCall;