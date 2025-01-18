"use strict";

import apiCall from "service";
import { addMessage } from "interface";

/** Load SumUp's API key from the server. */
const loadApiKey = async () => await apiCall({
    endpoint: "config/sumup",
    method: "POST",
});

/** Create a checkout resource. */
const createCheckoutResource = async (body) => await apiCall({
    endpoint: "money/create-checkout-resource",
    method: "POST",
    body: body,
});

/** Complete a checkout resource. */
const completeCheckoutResource = async (id, body, token) => await apiCall({
    endpoint: `https://api.sumup.com/v0.1/checkouts/${id}"`,
    method: "PUT",
    body: body,
    cookies: false,
    token: token,
    external: true,
});

/** Initialize a checkout rersource, complete it and trigger the payment. */
const initializeCheckoutResource = async () => {
    const { apiKey } = await loadApiKey();
    if (!apiKey) {
        addMessage(
            "No API key returned from the server. Please check and try again."
        );
        alert("Please set your SumUp API key on the server.");
    }

    const body = {
        amount: 10,
        description: "Sample one-time payment",
    };

    // Get the identifier of the checkout resource.
    const { id } = await createCheckoutResource(body);

    const details = {
        payment_type: "card",
        card: {
            name: "Boaty McBoatface",
            number: "4200000000000042",
            expiry_month: "12",
            expiry_year: "23",
            cvv: "123",
        },
    };

    // Complete a checkout
    const response = await completeCheckoutResource(id, details, apiKey);
    if (response.status === "PAID") console.log("All good!");
    console.dir(response);
};

const completePayment = () => {
    const form = document.querySelector("form");
    const completePaymentButton = document.querySelector(
        "button#complete-payment"
    );

    form.addEventListener("submit", handleFormSubmission);

    function handleFormSubmission(event) {
        event.preventDefault();
        validate();
        form.reportValidity();
        if (form.checkValidity() === false) {
            console.log("Invalid data found");
            // Handle invalid form data.
        } else {
            // On a production site do form submission.
            completePaymentButton.textContent = "Making payment...";
            completePaymentButton.disabled = "true";
            setTimeout(() => {
                alert("Made payment!");
            }, 500);
        }
    }

    // Do form validation.
    function validate() {
        // let message= '';
        // if (!/someregex/.test(someField.value)) {
        //   console.log(`Invalid value ${someField.value} for someField`);
        // 	 message = 'Explain how to enter a valid value';
        // }
        // someInput.setCustomValidity(message);
    }
};

export { initializeCheckoutResource };
