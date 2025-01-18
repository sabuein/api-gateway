import express from "express";
/** Use the web-push library to hide the implementation details of the communication between the application server and the push service. For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and https://tools.ietf.org/html/draft-ietf-webpush-encryption. */
import webpush from "web-push";
import { firebaseConfig, vapid } from "../../configuration/env.mjs";

if (!vapid.publicKey || !vapid.privateKey) {
    console.log("You must set your Vapid environment variables. You can use the following ones:");
    console.log(webpush.generateVAPIDKeys());
} else {
    // Set the keys used for encrypting the push messages.
    webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);
    webpush.setGCMAPIKey(vapid.gcm);
}

const router = express.Router();

const subscriptions = [];

/*

npm install firebase-admin
npm install firebase
npm install -g firebase-tools

## Deploy to Firebase Hosting

# Sign in to Google

firebase login

# Run this command from your app's root directory:

firebase init

# When you're ready, deploy your web app
## Put your static files (e.g., HTML, CSS, JS) in your app's deploy directory (the default is "public"). Then, run this command from your app's root directory:

firebase deploy

# After deploying, view your app at abuein-web-portal.web.app

*/    

router.post("/register", (req, res, next) => {
    try {
        // A real world application would store the subscription info.
        const { subscription } = req.body;
        if (!!subscription) {
            subscriptions.push(subscription);
            console.log(subscription);
            res.sendStatus(201);
        }
    } catch (error) {
        next(error);
    }
});

router.post("/sendNotification", (req, res) => {
    const {subscription, payload, ttl } = req.body;
    const options = {
        TTL: ttl,
    };

    setTimeout(() => {
        webpush
            .sendNotification(subscription, payload, options)
            .then(() => res.sendStatus(201))
            .catch((error) => {
                console.log(error);
                res.sendStatus(500);
            });
    }, req.body.delay * 1000);
});

const testPush = () => {
    // This is the same output of calling JSON.stringify on a PushSubscription
    const pushSubscription = {
        endpoint: "< Push Subscription URL >",
        keys: {
            p256dh: "< User Public Encryption Key >",
            auth: "< User Auth Secret >",
        },
    };

    const payload = "< Push Payload String >";

    const options = {
        gcmAPIKey: "< GCM API Key >",
        vapidDetails: {
            subject: "< 'mailto' Address or URL >",
            publicKey: "< URL Safe Base64 Encoded Public Key >",
            privateKey: "< URL Safe Base64 Encoded Private Key >",
        },
        timeout: "<Number>",
        TTL: "<Number>",
        headers: {
            "< header name >": "< header value >",
        },
        contentEncoding: "< Encoding type, e.g.: aesgcm or aes128gcm >",
        urgency: '< Default is "normal" >',
        topic: "< Use a maximum of 32 characters from the URL or filename-safe Base64 characters sets. >",

        proxy: "< proxy server options >",
        agent: "< https.Agent instance >",
    };

    webpush.sendNotification(pushSubscription, payload, options);
};

export default router;