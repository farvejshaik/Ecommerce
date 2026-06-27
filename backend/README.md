# Ecommerce Backend

A RESTful API backend for an ecommerce application built with Express, MongoDB, and Mongoose.

## Tech Stack

- **Runtime:** Node.js v20
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose 9
- **Auth:** JWT (access + refresh tokens), bcryptjs
- **File Uploads:** Multer + Cloudinary
- **Security:** Helmet, cookie-parser

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Auth route handlers
│   └── productController.js  # Product route handlers
├── middleware/
│   ├── auth.js               # Authentication & role authorization
│   ├── error.js              # Global error handler
│   └── multer.js             # File upload (Cloudinary)
├── models/
│   ├── Product.js            # Product schema & methods
│   └── User.js               # User schema & methods
├── routes/
│   ├── authRoutes.js         # Auth endpoint definitions
│   └── productRoutes.js      # Product endpoint definitions
├── utils/
│   ├── apiFeatures.js        # Search, filter, sort, pagination
│   ├── catchAsyncErrors.js   # Async error wrapper
│   ├── cloudinary.js         # Cloudinary config
│   ├── errorHandler.js       # Custom error class
│   └── sendToken.js          # JWT cookie + response helper
├── server.js                 # App entry point
└── package.json
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env` file

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

## API Endpoints

All routes are prefixed with `/api/v1`.

### Auth - Public

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | `/auth/register`      | Register a new user  |
| POST   | `/auth/login`         | Login                |
| POST   | `/auth/logout`        | Logout               |
| POST   | `/auth/refresh`       | Refresh access token |

### Auth - Protected

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| GET    | `/auth/me`             | Get current user |
| PUT    | `/auth/update/password`| Change password  |
| PUT    | `/auth/update/profile` | Update name/email|

### Products - Public

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| GET    | `/products`         | Get all products (search, filter, paginate) |
| GET    | `/product/:id`      | Get single product details     |
| GET    | `/product/reviews`  | Get reviews for a product      |

### Products - Protected

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| PUT    | `/product/review`   | Add/update review|
| DELETE | `/product/review`   | Delete review    |

### Products - Admin Only

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| POST   | `/admin/product/new`   | Create product    |
| PUT    | `/admin/product/:id`   | Update product    |
| DELETE | `/admin/product/:id`   | Delete product    |

## Models

### User

```js
{
  name: String,       // required, max 100 chars
  email: String,      // required, unique, validated
  password: String,   // required, min 6 chars, hashed, hidden by default
  role: String,       // "user" | "admin", default "user"
  avatar: {
    public_id: String,
    url: String
  },
  refreshToken: String,
  createdAt: Date
}
```

### Product

```js
{
  name: String,        // required, max 100 chars
  price: Number,       // required, min 0
  description: String, // required, max 2000 chars
  category: String,    // required
  stock: Number,       // required, default 1, min 0
  images: [{
    public_id: String,
    url: String
  }],
  ratings: Number,     // 0-5
  numOfReviews: Number,
  reviews: [Review],
  user: ObjectId,      // ref User
  createdAt: Date
}
```

## Authentication

- Passwords are hashed with bcrypt (10 rounds) via a Mongoose pre-save hook.
- On login, an access token and refresh token are generated.
- The refresh token is stored in an httpOnly cookie.
- Protected routes accept the token via `Authorization: Bearer <token>` header or the `refreshToken` cookie.
- The `isAuthenticatedUser` middleware verifies the token and attaches the user to `req.user`.
- The `authorizeRoles` middleware restricts access to specific roles (e.g., `"admin"`).

## Error Handling

- `ErrorHandler` class for custom operational errors with status codes.
- `catchAsyncErrors` wraps async handlers to forward rejected promises to Express error middleware.
- Global error middleware handles: invalid ObjectId (CastError), duplicate keys, validation errors, and JWT errors (invalid/expired).
- In development mode, error responses include the stack trace.
