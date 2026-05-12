import api from './api';

export const paymentService = {
  createStripeCheckoutSession: (payload) => api.post('/payments/stripe/create-checkout-session', payload)
};

export default paymentService;
