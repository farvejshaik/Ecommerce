# Ecommerce Backend

A RESTful API backend for an ecommerce application built with Express, MongoDB, and Mongoose.

## Tech Stack

- **Runtime:** Node.js v20
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose 9
- **Auth:** JWT (access + refresh tokens), bcryptjs
- **Security:** Helmet, cookie-parser

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── authController.js  # Auth route handlers
├── middleware/
│   ├── auth.js            # Authentication & role authorization
│   └── error.js           # Global error handler
├── models/
│   └── User.js            # User schema & methods
├── routes/
│   └── authRoutes.js      # Auth endpoint definitions
├── utils/
│   ├── catchAsyncErrors.js # Async error wrapper
│   ├── errorHandler.js     # Custom error class
│   └── sendToken.js        # JWT cookie + response helper
├── server.js              # App entry point
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

### Public

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/auth/register`      | Register a new user |
| POST   | `/auth/login`         | Login               |
| POST   | `/auth/logout`        | Logout              |
| POST   | `/auth/refresh`       | Refresh access token|

### Protected (Authenticated User)

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | `/auth/me`             | Get current user    |
| PUT    | `/auth/update/password`| Change password     |
| PUT    | `/auth/update/profile` | Update name/email   |

### Admin Only

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| GET    | `/admin/users`     | Get all users        |
| GET    | `/admin/user/:id`  | Get single user      |
| PUT    | `/admin/user/:id`  | Update user role     |
| DELETE | `/admin/user/:id`  | Delete user          |

## User Model

```js
{
  name: String,       // required, max 100 chars
  email: String,      // required, unique, validated
  password: String,   // required, min 6 chars, hashed with bcrypt, hidden by default
  role: String,       // "user" | "admin", default "user"
  avatar: {
    public_id: String,
    url: String
  },
  refreshToken: String,
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
