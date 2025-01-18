"use strict";

import apiCall from "service";
import { addMessage } from "interface";

const _config = { apiVersion: "2023-10-16" };

/** Load Stripe's publishable key from the server. */
const loadPublishableKey = async () => await apiCall({
    endpoint: "config/stripe",
    method: "POST"
});

/** On page load, we create a PaymentIntent on the server so that we have its clientSecret to initialize the instance of Elements below. The PaymentIntent settings configure which payment method types to display in the PaymentElement. */
const createPaymentIntent = async () => await apiCall({
    endpoint: "money/create-payment-intent",
    method: "POST"
});

const initializePaymentElement = async () => {
    // Enable more payment method types in your dashboard https://dashboard.stripe.com/settings/payment_methods
    const { publishableKey } = await loadPublishableKey();
    if (!publishableKey) {
        addMessage("No publishable key returned from the server. Please check and try again.");
        alert("Please set your Stripe publishable API key on the server.");
    }

    const stripe = Stripe(atob(publishableKey), _config);
    
    const { error: backendError, clientSecret } = await createPaymentIntent();

    if (backendError) addMessage(backendError.message);
    else addMessage(`Client secret returned.`);

    // Initialize Stripe Elements with the PaymentIntent's clientSecret,
    // then mount the payment element.
    const loader = "auto";
    const elements = stripe.elements({ clientSecret, loader });
    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");
    // Create and mount the linkAuthentication Element to enable autofilling customer payment details
    const linkAuthenticationElement = elements.create("linkAuthentication");
    linkAuthenticationElement.mount("#link-authentication-element");
    // If the customer's email is known when the page is loaded, you can
    // pass the email to the linkAuthenticationElement on mount:
    //
    //   linkAuthenticationElement.mount("#link-authentication-element",  {
    //     defaultValues: {
    //       email: 'jenny.rosen@example.com',
    //     }
    //   })
    // If you need access to the email address entered:
    //
    //  linkAuthenticationElement.on('change', (event) => {
    //    const email = event.value.email;
    //    console.log({ email });
    //  })

    // When the form is submitted...
    const form = document.getElementById("payment-form");
    let submitted = false;
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Disable double submission of the form
        if (submitted) {
            return false;
        }
        submitted = true;
        form.querySelector("button").disabled = true;

        const nameInput = document.querySelector("#name");

        // Confirm the payment given the clientSecret
        // from the payment intent that was just created on
        // the server.
        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/money/return`,
            },
        });

        if (stripeError) {
            addMessage(stripeError.message);

            // reenable the form.
            submitted = false;
            form.querySelector("button").disabled = false;
            return false;
        }
    });
};

const returnPaymentElement = async () => {
    const { publishableKey } = await loadPublishableKey();
    if (!publishableKey) {
        addMessage("No publishable key returned from the server. Please check and try again.");
        alert("Please set your Stripe publishable API key on the server.");
    }

    const stripe = Stripe(atob(publishableKey), _config);

    const url = new URL(window.location);
    const clientSecret = url.searchParams.get("payment_intent_client_secret");

    const { error, paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    if (error) addMessage(error.message);
    else addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
};

const initializeDonationCard = async () => {
    const { publishableKey } = await loadPublishableKey();
    if (!publishableKey) {
        addMessage("No publishable key returned from the server. Please check and try again.");
        alert("Please set your Stripe publishable API key on the server.");
    }

    const stripe = Stripe(atob(publishableKey), _config);
    const elements = stripe.elements();

    // Create our card inputs
    var style = {
        base: {
            color: "#ffffff",
        },
    };

    const card = elements.create("card", { style });
    card.mount("#card-element");

    const form = document.querySelector("form");
    const errorEl = document.querySelector("#card-errors");

    // Give our token to our form
    const stripeTokenHandler = (token) => {
        const hiddenInput = document.createElement("input");
        hiddenInput.setAttribute("type", "hidden");
        hiddenInput.setAttribute("name", "stripeToken");
        hiddenInput.setAttribute("value", token.id);
        form.appendChild(hiddenInput);

        form.submit();
    };

    // Create token from card data
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        stripe.createToken(card).then((res) => {
            if (res.error) errorEl.textContent = res.error.message;
            else {
                console.log("res.token................");
                console.dir(res.token);
                stripeTokenHandler(res.token);
            }
        });
    });
};

export { initializePaymentElement, returnPaymentElement, initializeDonationCard };
