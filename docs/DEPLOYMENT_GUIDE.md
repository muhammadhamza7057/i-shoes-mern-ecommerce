# Deployment Guide

## Frontend - Vercel
1. Push the `frontend/` app to GitHub.
2. Import the repository into Vercel.
3. Set environment variables:
   - `VITE_API_URL`
   - `VITE_STRIPE_PUBLIC_KEY` (optional)
4. Build command: `npm run build`
5. Output directory: `dist`

## Backend - Render or Railway
1. Push the `backend/` app to GitHub.
2. Create a new Web Service on Render or Railway.
3. Set environment variables:
   - `MONGODB_URI`
   - `PORT`
   - `JWT_SECRET`
   - `CORS_ORIGIN`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `STRIPE_SECRET_KEY` (optional)
4. Start command: `npm start`
5. Use MongoDB Atlas for production database.

## MongoDB Atlas
1. Create a cluster.
2. Add a database user.
3. Whitelist deployment IPs.
4. Replace the local URI with the Atlas connection string.

## Checklist
- [ ] Frontend environment variables set
- [ ] Backend environment variables set
- [ ] MongoDB Atlas connected
- [ ] Stripe configured if using card payments
- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] Health check verified
