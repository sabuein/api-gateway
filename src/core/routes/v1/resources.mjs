"use strict";

import express from "express";

const router = express.Router();

router.get("/about/:endpoint", (req, res) => {
    const endpoint = req.params.endpoint;
    if (!!endpoint) {
        const options = {
            record: null,
            title: null,
            heading: null,
            paragraph: null,
            layout: "default",
        };

        switch (endpoint) {
            case "/": {
                options.record = "endpoints/about/support";
                options.title = "About";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }
        }

        if (!!options?.record && !!options?.title) {
            res.status(200).render(options.record, {
                title: options.title,
                heading: options.heading,
                paragraph: options.paragraph,
                layout: options.layout,
            });
        }

    } else {
        console.log("No 'About' endpoint found in the request.");
    }
});

router.get("/help/:endpoint", (req, res) => {
    const endpoint = req.params.endpoint;
    if (!!endpoint) {
        const options = {
            record: null,
            title: null,
            heading: null,
            paragraph: null,
            layout: "default",
        };

        switch (endpoint) {
            case "support": {
                options.record = "endpoints/help/support";
                options.title = "Support Assistant";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }
        }

        if (!!options?.record && !!options?.title) {
            res.status(200).render(options.record, {
                title: options.title,
                heading: options.heading,
                paragraph: options.paragraph,
                layout: options.layout,
            });
        }
    } else {
        console.log("No endpoint found in the request.");
    }
});

router.get("/portal/:endpoint", (req, res) => {
    const endpoint = req.params.endpoint;
    if (!!endpoint) {
        const options = {
            record: null,
            title: null,
            heading: null,
            paragraph: null,
            layout: "default",
        };

        switch (endpoint) {
            case "confirmation": {
                options.record = "endpoints/portal/confirmation";
                options.title = "Confirmation";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "dashboard": {
                options.record = "endpoints/portal/dashboard";
                options.title = "Support assistant";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "notifications": {
                options.record = "endpoints/portal/notifications";
                options.title = "Support assistant";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "password": {
                options.record = "endpoints/portal/password";
                options.title = "Support assistant";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "posts": {
                options.record = "endpoints/portal/posts";
                options.title = "Support assistant";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "push": {
                options.record = "endpoints/portal/push";
                options.title = "Push Service";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "messaging": {
                options.record = "endpoints/portal/messaging";
                options.title = "Firebase Cloud Messaging";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "settings": {
                options.record = "endpoints/portal/settings";
                options.title = "Settings";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "signin": {
                options.record = "endpoints/portal/signin";
                options.title = "Sign In";
                options.heading = "Sign In to Your Account";
                options.paragraph = "Welcome back! Enter your credentials to access your personalized dashboard and stay on top of everything that matters.";
                break;
            }

            case "signout": {
                options.record = "endpoints/portal/signout";
                options.title = "Signout";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "signup": {
                options.record = "endpoints/portal/signup";
                options.title = "Signup";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "subscribe": {
                options.record = "endpoints/portal/subscribe";
                options.title = "Subscribe";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "sync": {
                options.record = "endpoints/portal/sync";
                options.title = "Synchronize";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "two-factor": {
                options.record = "endpoints/portal/two-factor";
                options.title = "Support assistant";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "upload": {
                options.record = "endpoints/portal/upload";
                options.title = "Upload";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "uploaded": {
                options.record = "endpoints/portal/uploaded";
                options.title = "Uploaded";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }

            case "verify": {
                options.record = "endpoints/portal/verify";
                options.title = "Verify";
                options.heading = "Hey habibi, let's get you some help.";
                options.paragraph = "Describe specifically what you want help with one issue at a time and we'll find the best possible solution.";
                break;
            }
        }

        if (!!options?.record && !!options?.title) {
            res.status(200).render(options.record, {
                title: options.title,
                heading: options.heading,
                paragraph: options.paragraph,
                layout: options.layout,
            });
        }
    } else {
        console.log("No endpoint found in the request.");
    }
});

router.get("/projects/:endpoint", (req, res) => {
    const endpoint = req.params.endpoint;
    if (!!endpoint) {
        const options = {
            record: null,
            title: null,
            heading: null,
            paragraph: null,
            layout: "default",
        };

        switch (endpoint) {
            case "game": {
                options.record = "endpoints/projects/game";
                options.title = "Game";
                options.heading = "You accessed our API root.!";
                options.paragraph = "ently—all in one secure location.";
                break;
            }

            case "location": {
                options.record = "endpoints/projects/location";
                options.title = "Location";
                options.heading = "You accessed our API root.!";
                options.paragraph = "ently—all in one secure location.";
                break;
            }

            case "map": {
                options.record = "endpoints/projects/map";
                options.title = "Map";
                options.heading = "You accessed our API root.!";
                options.paragraph = "ently—all in one secure location.";
                options.layout = "tomtom";
                break;
            }
        }

        if (!!options?.record && !!options?.title) {
            res.status(200).render(options.record, {
                title: options.title,
                heading: options.heading,
                paragraph: options.paragraph,
                layout: options.layout,
            });
        }
        
    } else {
        console.log("No endpoint found in the request.");
    }
});

router.get("/feeds/:endpoint", (req, res) => {
    const endpoint = req.params.endpoint;
    if (!!endpoint) {
        const options = {
            record: null,
            title: null,
            heading: null,
            paragraph: null,
            layout: "default",
        };

        switch (endpoint) {
            case "listen": {
                options.record = "endpoints/feeds/listen";
                options.title = "Homepage";
                options.heading = "You accessed our API root.!";
                options.paragraph = "ently—all in one secure location.";
                break;
            }

            case "read": {
                options.record = "endpoints/feeds/read";
                options.title = "Homepage";
                options.heading = "You accessed our API root.!";
                options.paragraph = "ently—all in one secure location.";
                break;
            }

            case "see": {
                options.record = "endpoints/feeds/see";
                options.title = "Homepage";
                options.heading = "You accessed our API root.!";
                options.paragraph = "ently—all in one secure location.";
                break;
            }

            case "watch": {
                options.record = "endpoints/feeds/watch";
                options.title = "Homepage";
                options.heading = "You accessed our API root.!";
                options.paragraph = "ently—all in one secure location.";
                break;
            }
        }

        if (!!options?.record && !!options?.title) {
            res.status(200).render(options.record, {
                title: options.title,
                heading: options.heading,
                paragraph: options.paragraph,
                layout: options.layout,
            });
        }
    } else {
        console.log("No endpoint found in the request.");
    }
});

router.get("/money/:endpoint", (req, res) => {
    const endpoint = req.params.endpoint;
    if (!!endpoint) {
        const options = {
            record: null,
            title: null,
            heading: null,
            paragraph: null,
            layout: "default",
        };

        switch (endpoint) {
            case "checkout": {
                options.record = "endpoints/money/checkout";
                options.title = "Checkout";
                options.heading = "You accessed our API root.!";
                options.paragraph = "ently—all in one secure location.";
                break;
            }

            case "completed": {
                options.record = "endpoints/money/completed";
                options.title = "Donation completed";
                options.heading = "Thank you for your generous donation. Your payment has been received.";
                options.paragraph = "ently—all in one secure location.";
                break;
            }

            case "donation": {
                options.record = "endpoints/money/donation";
                options.title = "Donation";
                options.heading = "You accessed our API root.!";
                options.paragraph = "ently—all in one secure location.";
                break;
            }

            case "payment": {
                options.record = "endpoints/money/payment";
                options.title = "Payment";
                options.heading = "You accessed our API root.!";
                options.paragraph = "ently—all in one secure location.";
                break;
            }

            case "return": {
                options.record = "endpoints/money/return";
                options.title = "Return";
                options.heading = "You accessed our API root.!";
                options.paragraph = "ently—all in one secure location.";
                break;
            }
        }

        if (!!options?.record && !!options?.title) {
            res.status(200).render(options.record, {
                title: options.title,
                heading: options.heading,
                paragraph: options.paragraph,
                layout: options.layout,
            });
        }
    } else {
        console.log("No endpoint found in the request.");
    }
});

router.get("/:endpoint", (req, res) => {
    const endpoint = req.params.endpoint;
    if (!!endpoint) {
        const options = {
            record: null,
            title: null,
            heading: null,
            paragraph: null,
            layout: "default",
        };

        switch (endpoint) {
            case "about": {
                options.record = "about";
                options.title = "About";
                options.heading = "About our platform";
                options.paragraph = "Learn more about the purpose, features, and vision behind this app—all in one place.";
                break;
            }

            case "admin": {
                options.record = "admin";
                options.title = "Admin";
                options.heading = "Administrator tools";
                options.paragraph = "Access powerful administrative tools to manage users, content, and app settings securely.";
                break;
            }

            case "contact": {
                options.record = "contact";
                options.title = "Contact";
                options.heading = `Contact us`;
                options.paragraph = "Get in touch with our team for support, feedback, or inquiries about this web app.";
                break;
            }

            case "feeds": {
                options.record = "feeds";
                options.title = "Feeds";
                options.heading = "Stay informed with feeds";
                options.paragraph = "Explore the latest updates and posts from various sections of our app, all in one feed.";
                break;
            }

            case "help": {
                options.record = "help";
                options.title = "Help";
                options.heading = "How can we help?";
                options.paragraph = "Find answers to common questions, troubleshooting tips, and guides to make the most of this app.";
                break;
            }

            case "money": {
                options.record = "money";
                options.title = "Money";
                options.heading = "Manage your finances";
                options.paragraph = "Keep track of transactions, budgets, and financial activities securely and efficiently.";
                break;
            }

            case "offline": {
                options.record = "offline";
                options.title = "Offline";
                options.heading = "Connect to the internet";
                options.paragraph = "You're currently offline. Check your internet connection to continue using the app.";
                break;
            }

            case "portal": {
                options.record = "portal";
                options.title = "Portal";
                options.heading = `Web portal`;
                options.paragraph = "Manage your account, explore features, and access all tools from one central location.";
                break;
            }

            case "projects": {
                options.record = "projects";
                options.title = "Projects";
                options.heading = `Explore our projects`;
                options.paragraph = "Discover current and past projects managed through this app, and track their progress.";
                break;
            }

            case "rss": {
                options.record = "rss";
                options.title = "RSS feeds";
                options.heading = `Really Simple Syndication (RSS) feeds`;
                options.paragraph = `RSS (Really Simple Syndication) is a web content syndication format that allows you to stay updated with your favorite sections of this web app. By subscribing to an RSS feed, you will receive real-time notifications whenever new content is added, enabling you to access updates conveniently without manually checking the site.`;
                break;
            }
        }

        if (!!options?.record && !!options?.title) {
            res.status(200).render(options.record, {
                title: options.title,
                heading: options.heading,
                paragraph: options.paragraph,
                layout: options.layout,
            });
        }
    } else {
        console.log("No endpoint found in the request.");
    }
});

/*
Marketing Preferences
BSI takes your privacy seriously. From time to time we would like to contact you with details of products and/or services we offer.
If you wish for BSI to contact you for marketing purposes please select which methods of contact you would like us to contact you on? (Select all that apply)
Email 
Phone 
SMS 
Direct Mail 

I have read the BSI Privacy Notice and consent to the processing of my personal data*
*/

// You have either already completed the survey or your session has expired.

router.get("/", (req, res) => {
    res.status(200).render("index", {
        title: "Home",
        heading: "Welcome to AbuEin Web Portal",
        paragraph: "AbuEin Web Portal is a simple app for the web, and desktop operating systems. It is built with HTML, CSS, JavaScript, and Progressive Web App features.",
        layout: "default",
    });
});

export default router;
