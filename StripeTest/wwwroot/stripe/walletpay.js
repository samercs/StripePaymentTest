// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.


initializeWalletPay();

async function initializeWalletPay() {
    const stripe2 = Stripe("pk_test_TYooMQauvdEDq54NiTphI7jx", { apiVersion: "2022-11-15" });
    let elements2;
    const appearance2 = {
        theme: 'stripe',
    };
    const response = await fetch("/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
    });
    const { clientSecret } = await response.json();
    elements2 = stripe.elements({ appearance2, clientSecret });
    
    const paymentRequest = stripe2.paymentRequest({
        country: 'AE',
        currency: 'usd',
        total: {
            label: 'Demo total',
            amount: 1400,
        },
        requestPayerName: true,
        requestPayerEmail: true,
    });

    const prButton = elements2.create('paymentRequestButton', {
        paymentRequest,
    });

    (async () => {
        // Check the availability of the Payment Request API first.
        const result = await paymentRequest.canMakePayment();
        if (result) {
            prButton.mount('#payment-request-button');
        } else {
            document.getElementById('payment-request-button').style.display = 'none';
        }
    })();

    paymentRequest.on('paymentmethod', async (ev) => {
        // Confirm the PaymentIntent without handling potential next actions (yet).
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret,
            {
                payment_method: ev.paymentMethod.id
            });

        if (confirmError) {
            // Report to the browser that the payment failed, prompting it to
            // re-show the payment interface, or show an error message and close
            // the payment interface.
            ev.complete('fail');
        } else {
            // Report to the browser that the confirmation was successful, prompting
            // it to close the browser payment method collection interface.
            ev.complete('success');
            // Check if the PaymentIntent requires any actions and if so let Stripe.js
            // handle the flow. If using an API version older than "2019-02-11"
            // instead check for: `paymentIntent.status === "requires_source_action"`.
            if (paymentIntent.status === "requires_action") {
                // Let Stripe.js handle the rest of the payment flow.
                const { error } = await stripe.confirmCardPayment(clientSecret);
                if (error) {
                    // The payment failed -- ask your customer for a new payment method.
                } else {
                    location.href = "https://localhost:44346/success";
                }
            } else {
                location.href = "https://localhost:44346/success";
            }
        }
    });
}