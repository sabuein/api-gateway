"use strict";

import express from "express";
import { money, vapid, firebaseConfig, videos, maps } from "../../configuration/env.mjs";

const router = express.Router();

router.post("/stripe", (req, res, next) => {
    try {
        res.status(200).json({ publishableKey: btoa(money.stripePublishableKey) });
    } catch (error) {
        next(error);
    }
});

router.post("/sumup", (req, res, next) => {
    try {
        res.status(200).json({ apiKey: btoa(money.sumupSecretKey) });
    } catch (error) {
        next(error);
    }
});

router.post("/youtube", (req, res, next) => {
    try {
        res.status(200).json({ apiKey: btoa(videos.youtube) });
    } catch (error) {
        next(error);
    }
});

// tomtom: "WpC8jDXAcKKEduy6CGB1slFg8L7m7N1R"
router.post("/tomtom", (req, res, next) => {
    try {
        res.status(200).json({ apiKey: btoa(maps.tomtom) });
    } catch (error) {
        next(error);
    }
});

router.post("/vapid", (req, res, next) => {
    try {
        res.status(200).json({ apiKey: btoa(vapid.publicKey) });
    } catch (error) {
        next(error);
    }
});

router.post("/firebase", (req, res, next) => {
    try {
        res.status(200).json({ firebaseConfig: btoa(JSON.stringify(firebaseConfig)) });
    } catch (error) {
        next(error);
    }
});

router.post("/firebase/admin", (req, res, next) => {
    try {
        res.status(200).json({ key: btoa(JSON.stringify(firebaseConfig)) });
    } catch (error) {
        next(error);
    }
});

export default router;