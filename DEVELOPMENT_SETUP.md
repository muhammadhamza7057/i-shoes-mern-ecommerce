# Development Setup Guide

This guide walks through setting up the I.Shoes project locally for development.

## Prerequisites

- **Node.js** v16.0.0 or higher
- **npm** or **yarn** package manager
- **MongoDB** (local or MongoDB Atlas cloud)
- **Git** for version control
- **VS Code** (recommended) or any code editor

## Step-by-Step Setup

### 1️⃣ Clone the Repository

```bash
cd f:\Shoes-website
git init
git add .
git commit -m "Initial commit: Project structure"
```

### 2️⃣ Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/ishoes
PORT=5000
JWT_SECRET=your_development_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

#### Start MongoDB (if local)

```bash
# Windows (if using MongoDB community edition)
mongod

# Or use MongoDB Compass for GUI management
```

#### Or Setup MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

#### Start Backend Server

```bash
npm run dev
```

Expected output:
```
Server running on http://localhost:5000
MongoDB connected successfully
```

### 3️⃣ Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Create Environment File

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v4.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### 4️⃣ Verify Setup

- **Frontend**: Open http://localhost:5173 in browser
- **Backend**: Test API with http://localhost:5000/api/products
- **MongoDB**: Check data in MongoDB Compass or Atlas

## Useful Commands

### Backend

```bash
# Development mode
npm run dev

# Production mode
npm start

# Run tests (future)
npm test

# Lint code
npm run lint
```

### Frontend

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure Quick Reference

```
backend/
├── models/          → Database schemas
├── controllers/     → Business logic
├── routes/          → API endpoints
├── middleware/      → Auth, validation, etc.
└── server.js        → Main server file

frontend/
├── src/
│   ├── components/  → Reusable UI components
│   ├── pages/       → Page components
│   ├── context/     → State management
│   ├── services/    → API calls
│   └── App.jsx      → Main app component
└── public/          → Static files
```

## Troubleshooting

### Backend Issues

**Port 5000 already in use**
```bash
# Find and kill process using port 5000
# Windows: 
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**MongoDB connection error**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- If using Atlas, whitelist your IP address

**JWT Secret not set**
```bash
# In .env, set:
JWT_SECRET=your_random_secret_key_min_32_characters
```

### Frontend Issues

**Port 5173 already in use**
```bash
npm run dev -- --port 5174
```

**CORS errors**
- Check backend `CORS_ORIGIN` matches `http://localhost:5173`
- Ensure backend is running on `http://localhost:5000`

**API not connecting**
- Verify `VITE_API_URL` in frontend `.env`
- Check backend is running and accessible
- Check browser console for errors

## Development Workflow

1. **Backend Development**
   - Make changes in `backend/` folder
   - Test with Postman or REST Client
   - Changes auto-reload with `npm run dev`

2. **Frontend Development**
   - Make changes in `frontend/src/`
   - Changes auto-reload in browser
   - Test with different screen sizes

3. **Testing Workflow**
   - Test locally before pushing
   - Use Chrome DevTools for debugging
   - Use MongoDB Compass for data inspection

## Next Steps

1. ✅ Setup backend server
2. ✅ Setup frontend server
3. 👉 Start building components (Step 2)
4. Build API endpoints (Step 3)
5. Integrate frontend with backend (Step 8)

---

For more details, see [ARCHITECTURE.md](./ARCHITECTURE.md)

