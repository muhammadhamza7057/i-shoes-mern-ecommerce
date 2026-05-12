# I.Shoes Database Schema

## User
- `email` - unique login email
- `password` - bcrypt hashed password
- `firstName`, `lastName`
- `phone`
- `role` - `user` or `admin`
- `avatar`
- `addresses` - saved shipping/billing addresses
- `wishlist` - product references

## Product
- `name`
- `description`
- `price`
- `discount`
- `finalPrice`
- `brand`
- `category`
- `collection`
- `gender`
- `sizes` - array of available sizes
- `colors` - array of available colors
- `images` - image objects with `url` and `altText`
- `stock`
- `rating`
- `reviews`
- `soldCount`
- `isActive`

## Cart
- `userId`
- `items[]`
  - `productId`
  - `quantity`
  - `price`
  - `discount`
  - `size`
  - `color`
  - `image`
  - `productName`
- `subtotal`
- `totalItems`

## Order
- `userId`
- `items[]`
  - `productId`
  - `quantity`
  - `price`
  - `size`
  - `color`
  - `image`
- `subtotal`
- `shippingCost`
- `discount`
- `totalPrice`
- `shippingAddress`
- `billingAddress`
- `paymentMethod` - `stripe` or `cod`
- `paymentStatus`
- `orderStatus`
- `transactionId`
- `notes`
- `estimatedDelivery`
- `deliveredAt`
- `cancelledAt`
- `cancellationReason`
