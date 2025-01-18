"use strict";

// /src/configuration/env.mjs
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

const general = {
    domain: (process.env.DOMAIN ??= ""),
};

const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
};

const authentication = {
    // The secret is used to sign and validate signatures.
    jwt: process.env.JWT_SECRET,
    // The audience and issuer are used for validation purposes.
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    // The secret is used to sign and validate cookies.
    cookie: process.env.COOKIE_SECRET,
    // The secret is used to sign and validate sessions.
    session: process.env.SESSION_SECRET,
};

const settings = {
    // The basic API port and prefix configuration values are:
    port: (process.env.PORT ??= 3000),
    prefix: (process.env.API_PREFIX ??= "api"),
};

const money = {
    // See your keys here: https://dashboard.stripe.com/apikeys
    stripePublishableKey: (process.env.STRIPE_PUBLISHABLE_KEY ??= ""),
    stripeSecretKey: (process.env.STRIPE_SECRET_KEY ??= ""),
    // https://app.abuein.com/api/money/webhook
    stripeWebhookSecretKey: (process.env.STRIPE_WEBHOOK_SECRET ??= ""),
    // https://developer.sumup.com/api-keys
    sumupSecretKey: (process.env.SUMUP_SECRET_KEY ??= ""),
};

const videos = {
    youtube: (process.env.YOUTUBE_API_KEY ??= ""),
};

/** Your web app's Firebase project configuration here, for Firebase JS SDK v7.20.0 and later, measurementId is optional. */
// See: https://firebase.google.com/docs/web/learn-more#config-object
// See: https://firebase.google.com/docs/web/setup#add-sdks-initialize
const firebaseConfig = {
    apiKey: (process.env.FIREBASE_API_KEY ??= ""),
    authDomain: (process.env.FIREBASE_AUTH_DOMAIN ??= ""),
    projectId: (process.env.FIREBASE_PROJECT_ID ??= ""),
    storageBucket: (process.env.FIREBASE_STORAGE_BUCKET ??= ""),
    messagingSenderId: (process.env.FIREBASE_MESSAGING_SENDER_ID ??= ""),
    appId: (process.env.FIREBASE_APP_ID ??= ""),
    measurementId: (process.env.FIREBASE_MEASUREMENT_ID ??= ""),
};

const vapid = {
    subject: (process.env.VAPID_SUBJECT ??= ""),
    publicKey: (process.env.VAPID_PUBLIC_KEY ??= ""),
    privateKey: (process.env.VAPID_PRIVATE_KEY ??= ""),
    gcm: (firebaseConfig.apiKey ??= "Your Google Cloud Messaging API Key")
};

const maps = {
    tomtom: (process.env.TOMTOM_API_KEY ??= ""),
};

export { general, db, authentication, settings, money, videos, firebaseConfig, vapid, maps };