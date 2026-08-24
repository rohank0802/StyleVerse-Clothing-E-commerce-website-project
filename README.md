StyleVerse — Clothing E-Commerce Website

StyleVerse is a full-stack clothing e-commerce application built using the MERN stack. The project includes buyer and seller functionality, secure authentication, role-based authorization, product variants, cart management, inventory management, Google OAuth, image uploads, and Razorpay payment integration.

🚀 Project Overview

StyleVerse provides a complete e-commerce workflow where buyers can browse products, select specific variants such as size and color, manage their cart, and make payments through Razorpay.

The application also includes a dedicated seller section for managing products and variants. Protected routes and role-based authorization ensure that buyers and sellers can access only the features intended for their respective roles.

✨ Features
🔐 Authentication & Authorization
User registration and login
JWT-based authentication
Access token and refresh token system
HTTP-only cookies
Protected frontend routes
Protected backend routes
Buyer and seller role-based authorization
Google OAuth authentication
Authentication state management
Refresh token handling
Secure logout/token invalidation
🛍️ Buyer Features
Browse clothing products
Product details
Product variants
Size and color selection
Variant-specific pricing
Variant-specific stock
Add products/variants to cart
Increase/decrease cart quantity
Remove cart items
Cart total calculation
Product search
Protected checkout
Razorpay payment
Payment verification
Inventory update after successful payment
Automatic cart cleanup after successful purchase
🏪 Seller Features
Seller authentication
Seller authorization
Protected seller routes
Seller dashboard
Product management
Product variant management
Variant-specific price and stock
Product image management
Seller-only access to seller functionality
💳 Razorpay Payment Integration

The project implements a complete Razorpay payment workflow:

User adds products/variants to the cart.
Backend checks product and variant stock.
Backend creates a Razorpay order.
Frontend initiates the Razorpay payment.
Razorpay returns payment details.
Backend verifies the Razorpay payment signature.
Payment status is updated.
Purchased variant stock is decreased.
Purchased items are removed from the cart.

A final stock check is also performed during payment verification to prevent invalid inventory updates if stock changes while the customer is completing payment.

🎨 Frontend Architecture

The frontend is organized around features, keeping buyer, seller, and authentication functionality separated.

Frontend/
└── src/
    └── features/
        ├── auth/
        ├── buyer/
        └── seller/

Each feature is further organized according to its responsibility.

For example:

features/
├── auth/
│   ├── api/
│   ├── hooks/
│   └── pages/
│
├── buyer/
│   ├── api/
│   ├── hooks/
│   └── pages/
│
└── seller/
    ├── api/
    ├── hooks/
    └── pages/
Feature Structure

Each major feature contains separate sections for:

API services — communication with backend REST APIs
Hooks — reusable feature-specific React logic
Pages/JSX — UI and page-level components

This structure keeps the frontend modular and makes it easier to maintain and scale as new features are added.

Frontend Technologies
React.js
React Router DOM
Redux Toolkit
React-Redux
Axios
Tailwind CSS
DaisyUI
JavaScript
Protected routes
Custom React hooks
Feature-based architecture
⚙️ Backend Architecture

The backend is built using Node.js and Express.js and follows a modular architecture.

Backend/
└── src/
    ├── controllers/
    ├── dao/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── validators/
    ├── services/
    └── config/
Backend Responsibilities
Authentication
Google OAuth
Authorization
User management
Product management
Seller functionality
Cart management
Payment processing
Payment verification
Inventory management
Request validation
Error handling
REST API development
🗄️ Database & MongoDB

MongoDB with Mongoose is used for storing application data.

Main data areas include:

Users
Products
Product variants
Carts
Payment details
Seller information
MongoDB Concepts Used
Mongoose schemas and models
ObjectId references
MongoDB aggregation pipelines
$lookup
$unwind
$match
$elemMatch
$inc
$pull
findOneAndUpdate
MongoDB transactions/session-based operations

Product inventory is maintained at the variant level, allowing different sizes/colors of the same product to have independent prices and stock.

🛒 Cart & Inventory Management

The cart stores the relationship between:

Product
   ↓
Variant
   ↓
Quantity

MongoDB aggregation is used to retrieve the product and selected variant information required by the frontend.

After successful payment, the backend uses the saved:

productId
variantId
quantity

to locate the exact variant in the products collection and decrease its stock.

The purchased item is then removed from the user's cart.

💳 Payment Flow
Buyer
  ↓
Add product variant to cart
  ↓
Checkout
  ↓
Check stock
  ↓
Create Razorpay Order
  ↓
Razorpay Payment
  ↓
Backend Payment Verification
  ↓
Verify Razorpay Signature
  ↓
Decrease Variant Stock
  ↓
Remove Purchased Cart Items
  ↓
Mark Payment as Paid
🔑 Environment Variables

The project uses environment variables to keep sensitive configuration and API credentials outside the source code.

Backend Environment Variables
MONGO_URI=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

Depending on your exact implementation, variable names may differ slightly. The important configuration used by the project includes:

MongoDB URI
Google OAuth credentials
Access JWT secret
Refresh JWT secret
ImageKit credentials
Razorpay Key ID
Razorpay Key Secret

Important: Never commit .env files or secret keys to GitHub.

🖼️ Image Management

ImageKit is used for handling product image uploads.

The backend uses ImageKit credentials stored in environment variables rather than exposing private credentials in the frontend.

🧠 Key Concepts Implemented

This project provided practical experience with:

MERN stack development
React feature-based architecture
React Router
Protected routes
Role-based authorization
JWT authentication
Access and refresh token flow
HTTP-only cookies
Google OAuth
Redux Toolkit
REST APIs
Axios
MongoDB and Mongoose
MongoDB aggregation
Product/variant data modeling
Cart business logic
Variant-level inventory management
Razorpay integration
Razorpay signature verification
ImageKit
API validation
Error handling
DAO architecture
Middleware
Git and GitHub
🛠️ Tech Stack
Frontend
React.js
React Router DOM
Redux Toolkit
React-Redux
Axios
Tailwind CSS
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
Google OAuth
Razorpay
ImageKit
Tools
VS Code
Git
GitHub
Postman
MongoDB Compass
📁 High-Level Project Structure
StyleVerse-Clothing-E-commerce-website-project/
│
├── Backend/
│   └── src/
│       ├── controllers/
│       ├── dao/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── validators/
│       ├── services/
│       └── config/
│
├── Frontend/
│   └── src/
│       └── features/
│           ├── auth/
│           │   ├── api/
│           │   ├── hooks/
│           │   └── pages/
│           │
│           ├── buyer/
│           │   ├── api/
│           │   ├── hooks/
│           │   └── pages/
│           │
│           └── seller/
│               ├── api/
│               ├── hooks/
│               └── pages/
│
└── README.md

This structure separates authentication, buyer functionality, and seller functionality while keeping API services, reusable hooks, and UI pages organized within each feature.
