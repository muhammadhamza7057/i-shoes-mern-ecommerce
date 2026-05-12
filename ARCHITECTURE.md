# I.Shoes - System Architecture

## 🏗️ Project Structure Overview

```
I.Shoes/
├── backend/                          # Node.js + Express API
│   ├── config/                       # Configuration files
│   │   ├── db.js                    # MongoDB connection
│   │   ├── env.js                   # Environment variables
│   │   └── constants.js             # App constants
│   ├── middleware/                   # Custom middleware
│   │   ├── auth.js                  # JWT authentication
│   │   ├── errorHandler.js          # Global error handler
│   │   └── validation.js            # Request validation
│   ├── models/                       # Mongoose schemas
│   │   ├── User.js                  # User schema
│   │   ├── Product.js               # Product schema
│   │   ├── Cart.js                  # Cart schema
│   │   └── Order.js                 # Order schema
│   ├── controllers/                  # Business logic
│   │   ├── authController.js        # Auth operations
│   │   ├── productController.js     # Product CRUD
│   │   ├── cartController.js        # Cart management
│   │   └── orderController.js       # Order processing
│   ├── routes/                       # API endpoints
│   │   ├── auth.js                  # /api/auth
│   │   ├── products.js              # /api/products
│   │   ├── cart.js                  # /api/cart
│   │   └── orders.js                # /api/orders
│   ├── validators/                   # Input validation schemas
│   │   ├── authValidators.js        # Auth validation
│   │   └── productValidators.js     # Product validation
│   ├── utils/                        # Helper functions
│   │   ├── jwt.js                   # JWT utilities
│   │   ├── passwordHash.js          # Password encryption
│   │   └── logger.js                # Logging utility
│   ├── server.js                     # Express app setup
│   ├── .env.example                  # Environment template
│   └── package.json                  # Dependencies
│
├── frontend/                         # React + Vite
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── common/              # Common components
│   │   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   │   ├── Footer.jsx       # Footer
│   │   │   │   ├── LoadingSkeleton.jsx
│   │   │   │   └── Toast.jsx        # Toast notifications
│   │   │   ├── product/             # Product components
│   │   │   │   ├── ProductCard.jsx  # Product card
│   │   │   │   ├── ProductGallery.jsx
│   │   │   │   ├── Filters.jsx      # Filter sidebar
│   │   │   │   └── RelatedProducts.jsx
│   │   │   └── admin/               # Admin components
│   │   │       ├── ProductForm.jsx
│   │   │       ├── OrderManagement.jsx
│   │   │       └── Dashboard.jsx
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.jsx             # Homepage
│   │   │   ├── Products.jsx         # Products listing
│   │   │   ├── ProductDetail.jsx    # Product detail
│   │   │   ├── Cart.jsx             # Cart page
│   │   │   ├── Checkout.jsx         # Checkout page
│   │   │   ├── OrderHistory.jsx     # Order history
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Register page
│   │   │   ├── AdminDashboard.jsx   # Admin panel
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── context/                  # State management
│   │   │   ├── AuthContext.jsx      # Auth state
│   │   │   └── CartContext.jsx      # Cart state
│   │   ├── hooks/                    # Custom hooks
│   │   │   ├── useAuth.js           # Auth hook
│   │   │   ├── useCart.js           # Cart hook
│   │   │   ├── useFetch.js          # Fetch hook
│   │   │   └── useDebounce.js       # Debounce hook
│   │   ├── services/                 # API services
│   │   │   ├── api.js               # Axios instance
│   │   │   ├── authService.js       # Auth API calls
│   │   │   ├── productService.js    # Product API calls
│   │   │   └── orderService.js      # Order API calls
│   │   ├── utils/                    # Utilities
│   │   │   ├── constants.js         # App constants
│   │   │   ├── formatters.js        # Format helpers
│   │   │   └── validators.js        # Form validation
│   │   ├── styles/                   # Global styles
│   │   │   ├── globals.css          # Global CSS
│   │   │   ├── animations.css       # Animation classes
│   │   │   └── tailwind.config.js   # Tailwind config
│   │   ├── assets/                   # Images, icons, etc.
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Vite entry point
│   ├── public/                       # Static assets
│   ├── index.html                    # HTML template
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── .env.example                 # Environment template
│   └── package.json                 # Dependencies
│
├── docs/                             # Documentation
│   ├── API_DOCUMENTATION.md         # API endpoints
│   ├── DATABASE_SCHEMA.md           # DB schema details
│   ├── DEVELOPMENT_GUIDE.md         # Development setup
│   └── DEPLOYMENT_GUIDE.md          # Deployment instructions
│
├── README.md                         # Project overview
├── .gitignore                        # Git ignore rules
└── package.json                      # Root package.json

```

---

## 🎯 Architecture Principles

### **Backend Architecture: MVC Pattern**
- **Models**: Mongoose schemas for data structure
- **Controllers**: Business logic and data processing
- **Routes**: API endpoint definitions
- **Middleware**: Cross-cutting concerns (auth, validation, error handling)

### **Frontend Architecture: Component-Based**
- **Components**: Reusable UI building blocks
- **Pages**: Full page components that combine smaller components
- **Context API**: Global state management for Auth and Cart
- **Services**: Centralized API communication
- **Custom Hooks**: Logic reusability

### **Security**
- JWT tokens for authentication
- bcrypt for password hashing
- Protected routes (frontend)
- Admin role authorization (backend)
- Input validation on both ends

### **Performance**
- Component code-splitting
- Lazy loading for routes and images
- Debounced search
- Skeleton loaders for better UX
- Optimized animations (Framer Motion + GSAP)

---

## 📡 API Architecture

### **Base URL**
```
Development: http://localhost:5000/api
Production: https://ishoes-api.onrender.com/api
```

### **API Routes**

```
/api/auth
  ├── POST   /register         - User registration
  ├── POST   /login            - User login
  └── GET    /me               - Get current user (protected)

/api/products
  ├── GET    /                 - Get all products (with filters, search, pagination)
  ├── GET    /:id              - Get single product
  ├── POST   /                 - Create product (admin only)
  ├── PATCH  /:id              - Update product (admin only)
  └── DELETE /:id              - Delete product (admin only)

/api/orders
  ├── POST   /                 - Create order (protected)
  ├── GET    /                 - Get user's orders (protected)
  ├── GET    /all              - Get all orders (admin only)
  ├── GET    /:id              - Get order details
  ├── PATCH  /:id/status       - Update order status (admin only)
  └── DELETE /:id              - Cancel order

/api/cart
  ├── GET    /                 - Get user's cart (protected)
  ├── POST   /add              - Add item to cart (protected)
  ├── PATCH  /:id              - Update cart item quantity (protected)
  └── DELETE /:id              - Remove item from cart (protected)
```

---

## 🗄️ Database Schema

### **User Schema**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (enum: ['user', 'admin']),
  avatar: String,
  phone: String,
  addresses: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### **Product Schema**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  discount: Number,
  sizes: Array,
  colors: Array,
  brand: String,
  gender: String (enum: ['men', 'women', 'unisex']),
  category: String (enum: ['Sneakers', 'Formal', 'Slippers', 'Sports', 'Boots']),
  images: Array,
  stock: Number,
  rating: Number,
  reviews: Array,
  collection: String (enum: ['Summer', 'Winter', 'New Arrivals', 'Best Sellers']),
  createdAt: Date,
  updatedAt: Date
}
```

### **Order Schema**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: Array [{
    productId: ObjectId,
    quantity: Number,
    price: Number,
    size: String,
    color: String
  }],
  totalPrice: Number,
  discount: Number,
  finalPrice: Number,
  shippingAddress: Object,
  paymentMethod: String (enum: ['stripe', 'cod']),
  paymentStatus: String (enum: ['pending', 'completed', 'failed']),
  orderStatus: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Data Flow

### **User Registration & Login Flow**
1. User submits credentials on Register/Login page
2. Frontend validates input
3. API request sent to backend
4. Backend validates and processes
5. JWT token generated
6. Token stored in localStorage
7. User redirected to home

### **Product Browsing Flow**
1. User visits products page
2. Filters and search parameters applied
3. API request with query parameters
4. Backend filters and returns data
5. Products displayed with skeleton loader
6. Animations triggered on load

### **Add to Cart Flow**
1. User clicks "Add to Cart" on product
2. Item added to cart context
3. Toast notification shown
4. Cart count updated in navbar
5. Cart synced with localStorage

### **Checkout Flow**
1. User navigates to cart
2. Enters shipping details
3. Selects payment method
4. Creates order via API
5. Payment processing (Stripe/COD)
6. Order confirmation
7. Email sent (optional)

---

## 🔐 Authentication & Authorization

### **JWT Implementation**
- Token issued on login
- Stored in localStorage
- Sent with every protected request
- 7-day expiration

### **Protected Routes**
- Cart page (users only)
- Order history (users only)
- Checkout (users only)
- Admin dashboard (admins only)

---

## 🚀 Deployment Architecture

### **Frontend (Vercel)**
- Automatic deployments from GitHub
- Environment variables configured
- CDN for static assets
- Auto HTTPS

### **Backend (Render/Railway)**
- Node.js environment
- Environment variables for secrets
- MongoDB Atlas connection
- Auto-deploy from GitHub

### **Database (MongoDB Atlas)**
- Cloud-hosted MongoDB
- Auto-backups
- Connection pooling
- Security rules

---

## 📊 Performance Considerations

1. **Frontend**
   - Code splitting per route
   - Image optimization
   - Lazy loading components
   - Debounced search (300ms)
   - Memoized components

2. **Backend**
   - Database indexing on frequently queried fields
   - Pagination for large datasets
   - Caching strategies
   - Rate limiting for APIs

3. **Animation**
   - Use Framer Motion for smooth transitions
   - GSAP for scroll-triggered effects
   - Hardware acceleration with CSS
   - Avoid blocking animations

---

## 🔧 Development Workflow

1. Setup backend with Node + MongoDB
2. Build API endpoints (test with Postman)
3. Setup frontend with Vite + React
4. Build components with Tailwind CSS
5. Implement state management (Context API)
6. Add animations (Framer Motion + GSAP)
7. Test responsiveness
8. Deploy frontend and backend
9. Monitor and optimize

