'use client'
import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'https://yourdomain.com/checkout-success',
      },
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your custom order summary here */}
      <PaymentElement
        options={{
          layout: {
            type: 'accordion', // or 'tabs' to revert to the previous layout
            defaultCollapsed: false,
          },
          fields: {
            billingDetails: {
              name: 'auto',
              email: 'auto',
              phone: 'auto',
              address: 'if_required',
            },
          },
        }}
      />
      <button type="submit" disabled={!stripe}>Pay Now</button>
    </form>
  );
}
