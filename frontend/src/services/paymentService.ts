import type { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';;

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');
  }
  return stripePromise;
};

export const processPayment = async (paymentData: {
  amount: number;
  description: string;
  returnUrl: string;
}) => {
  try {
    const response = await fetch('/api/v1/payment/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong with payment');
    }

    const { clientSecret } = await response.json();
    const stripe = await getStripe();

    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: await stripe.elements().create('card'),
      },
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};

export const createPaymentIntent = async (amount: number) => {
  try {
    const response = await fetch('/api/v1/payment/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
