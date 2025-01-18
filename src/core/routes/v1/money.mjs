"use strict";

// /src/routes/v1/money.mjs

import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { general, money } from "../../configuration/env.mjs";
import { stripeOptions } from "../../configuration/options.mjs";
import Stripe from "stripe";
import validate from "../../middlewares/validation.mjs";
import {
    postSchema,
    newPostSchema,
} from "../../validations/postValidation.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const stripe = new Stripe(money.stripeSecretKey, stripeOptions());

const HOME_URL = general.domain;

/** Set calcuateTax to true if you want Stripe to calculate tax for the transactions in this application. */
const calculateTax = false;

router.post("/donate", (req, res, next) => {
    try {
        stripe.customers
            .create({
                name: req.body.name,
                email: req.body.email,
                source: req.body.stripeToken,
            })
            .then((customer) =>
                stripe.charges.create({
                    amount: req.body.amount * 100,
                    currency: "gbp",
                    customer: customer.id,
                })
            )
            .then(() => res.status(200).redirect(`${HOME_URL}/money/completed`))
            .catch((error) => console.log(error));
    } catch (error) {
        next(error);
    }
});

/** Optionally - Stripe Tax lets you calculate and collect sales tax, VAT and GST with one line of code.
To enable Stripe Tax set up in the dashboard: [Docs - Set up Stripe Tax](https://stripe.com/docs/tax/set-up). */
const calculate_tax = async (orderAmount, currency) => {
    const taxCalculation = await stripe.tax.calculations.create({
        currency,
        customer_details: {
            address: {
                line1: "10709 Cleary Blvd",
                city: "Plantation",
                state: "FL",
                postal_code: "33322",
                country: "US",
            },
            address_source: "shipping",
        },
        line_items: [
            {
                amount: orderAmount,
                reference: "ProductRef",
                tax_behavior: "exclusive",
                tax_code: "txcd_30011000",
            },
        ],
    });

    return taxCalculation;
};

router.post("/create-payment-intent", async (req, res, next) => {
    // Create a PaymentIntent with the amount, currency, and a payment method type.
    // See the documentation [0] for the full list of supported parameters.
    // [0] https://stripe.com/docs/api/payment_intents/create
    let orderAmount = 1500;
    let paymentIntent;

    try {
        if (calculateTax) {
            let taxCalculation = await calculate_tax(orderAmount, "gbp");

            paymentIntent = await stripe.paymentIntents.create({
                currency: "gbp",
                amount: taxCalculation.amount_total,
                automatic_payment_methods: { enabled: true },
                metadata: { tax_calculation: taxCalculation.id },
            });
        } else {
            paymentIntent = await stripe.paymentIntents.create({
                currency: "gbp",
                amount: orderAmount,
                automatic_payment_methods: { enabled: true },
            });
        }

        // Send publishable key and PaymentIntent details to client
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        error.status = 400;
        next(error);
    }
});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks
router.post("/webhook", async (req, res) => {
    let data, eventType;

    // Check if webhook signing is configured.
    if (money.webhookSecretKey) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];
        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                money.stripeWebhookSecretKey
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`);
            return res.sendStatus(400);
        }
        data = event.data;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // we can retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }

    if (eventType === "payment_intent.succeeded") {
        // Funds have been captured
        // Fulfill any orders, e-mail receipts, etc
        // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
        console.log("💰 Payment captured!");
    } else if (eventType === "payment_intent.payment_failed") {
        console.log("❌ Payment failed.");
    }

    res.sendStatus(200);
});

/*
curl -X POST \
  https://api.sumup.com/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials'\
  -d 'client_id=fOcmczrYtYMJ7Li5GjMLLcUeC9dN'\
  -d 'client_secret=717bd571b54297494cd7a79b491e8f2c1da6189c4cc2d3481380e8366eef539c'
*/

/** Create a new SumUp checkout resource with the required parameters for the request. For a full list of the available parameters, see the API Reference at https://developer.sumup.com/api/checkouts/create. */
router.post("/create-checkout-resource", async (req, res, next) => {
    // req.body will contain the text fields, if there were any.
    const {
        amount, // Amount of the payment.
        description
    } = req.body;
    
    const url = "https://api.sumup.com/v0.1/checkouts",
        headers = {
            "Host": "app.abuein.com",
            "Origin": "https://app.abuein.com",
            "Authorization": `Bearer ${money.sumupSecretKey}`,
            "Content-Type": "application/json",
        },
        body = {
            currency: "GBP", // The three-letter ISO4217 code of the currency in which the payment is made. The value must match the currency registered for the merchant user to whom the payment is made (as specified in pay_to_email).
            checkout_reference: "CO746453", // Unique ID of the payment checkout specified by the client application when creating the checkout resource.
            pay_to_email: "sabuein@gmail.com", // The email address of the registered merchant user to whom the payment is made.
            amount: amount,
            description: description,
        };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: body,
        });

        console.log("response", response);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        
        console.log("data", data);

        res.status(200).json(data);
    } catch (error) {
        error.status = 400;
        next(error);
    }
});

export default router;
