import Stripe from 'stripe';
import { envConfig } from '../config/env.js';
import { createError } from '../middleware/errorHandler.js';

const stripe = envConfig.STRIPE_SECRET_KEY ? new Stripe(envConfig.STRIPE_SECRET_KEY) : null;

export const createCheckoutSession = async (req, res, next) => {
  try {
    if (!stripe) {
      throw createError('Stripe is not configured on the server', 400);
    }

    const { items = [], successUrl, cancelUrl } = req.body;

    if (!items.length) {
      throw createError('No items provided for checkout session', 400);
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : []
        },
        unit_amount: Math.round((item.price || 0) * 100)
      },
      quantity: item.quantity || 1
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl || 'http://localhost:5173/orders',
      cancel_url: cancelUrl || 'http://localhost:5173/cart'
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    next(error);
  }
};

export default { createCheckoutSession };