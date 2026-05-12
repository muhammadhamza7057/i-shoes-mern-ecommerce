# I.Shoes API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: your deployed Render/Railway URL

## Health
- `GET /health` - API health check
- `GET /db-status` - Database connection status

## Auth
- `POST /auth/register` - Register a user
- `POST /auth/login` - Login user
- `GET /auth/me` - Current user profile
- `PATCH /auth/me` - Update current user profile

## Products
- `GET /products` - List products with filters, search, sort, pagination
- `GET /products/featured` - Featured products
- `GET /products/:id` - Product details
- `POST /products` - Create product (admin)
- `PATCH /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Query parameters for `GET /products`
- `page`, `limit`
- `search`
- `category`
- `brand`
- `gender`
- `collection`
- `size`
- `color`
- `minPrice`, `maxPrice`
- `rating`
- `sortBy`, `sortOrder`

## Cart
- `GET /cart` - Get current user's cart
- `POST /cart/add` - Add item to cart
- `PATCH /cart/:itemId` - Update cart quantity
- `DELETE /cart/:itemId` - Remove cart item
- `DELETE /cart` - Clear cart

## Orders
- `POST /orders` - Place order
- `GET /orders` - My orders
- `GET /orders/all` - All orders (admin)
- `GET /orders/:id` - Single order details
- `PATCH /orders/:id/status` - Update order status (admin)
- `DELETE /orders/:id` - Cancel order

## Auth Header
Use a Bearer token for protected routes:

```http
Authorization: Bearer <jwt-token>
```

## Response Shape
Most endpoints return:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```
