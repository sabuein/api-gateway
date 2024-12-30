"use strict";

/** Validation ensures the inputs meet certain criteria, such as correct format, length, or type. */

// Validation: Check if input is a valid email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validation: Check if input is a valid phone number (UK example)
function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\+44\d{10}$/; // e.g., +447123456789
    return phoneRegex.test(phoneNumber);
}

// Validation: Check if string length is within range
function isValidLength(input, minLength, maxLength) {
    return input.length >= minLength && input.length <= maxLength;
}

// Validation: Check if input contains only alphanumeric characters
function isAlphanumeric(input) {
    const alphaNumericRegex = /^[a-z0-9]+$/i;
    return alphaNumericRegex.test(input);
}

// Validation: Check if a field is not empty
function isNotEmpty(input) {
    return input.trim().length > 0;
}