"use strict";

/** Sanitisation removes or escapes potentially harmful characters or patterns. */

// Sanitization: Remove potentially harmful HTML tags
function sanitizeHTML(input) {
    const tempDiv = document.createElement("div");
    tempDiv.innerText = input;
    return tempDiv.innerHTML; // Escaped HTML
}

// Sanitization: Remove special characters (for basic input sanitization)
function sanitizeBasic(input) {
    return input.replace(/[^a-zA-Z0-9\s]/g, "");
}

// Sanitization: Trim whitespaces
function sanitizeTrim(input) {
    return input.trim();
}

// Sanitization: Convert to lowercase
function sanitizeToLowerCase(input) {
    return input.toLowerCase();
}

// Sanitization: Encode special characters (e.g., for URLs)
function sanitizeForURL(input) {
    return encodeURIComponent(input);
}