# ☕ Coffee Membership Backend

A robust, enterprise-grade RESTful API backend service for the **Coffee Membership Platform**, designed for managing coffee shops, customer memberships, digital coffee redemptions via QR codes, multi-session JWT authentication, analytics dashboards, and role-based access control.

Built with **Node.js**, **Express 5**, **TypeScript**, and **MongoDB (Mongoose)**, fully containerized using **Docker & Docker Compose**.

---

## 📑 Table of Contents

- [Features](#-features)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [User Roles & Permissions](#-user-roles--permissions)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Database Seeding](#-database-seeding)
- [How to Run](#-how-to-run)
  - [Using Docker Compose (Recommended)](#1-using-docker-compose-recommended)
  - [Using Standalone Docker](#2-using-standalone-docker)
  - [Local Development (Without Docker)](#3-local-development-without-docker)
- [API Reference](#-api-reference)
- [Security & Best Practices](#-security--best-practices)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## ✨ Features

- **🔐 Multi-Role Authentication & Session Management:**
  - Roles: `super_admin`, `admin`, `owner`, and `customer`.
  - Access & Refresh tokens with HTTP-only secure cookie support.
  - Multi-session concurrency control (`MAX_SESSIONS`) with device tracking and auto-cleanup.
  - 6-digit OTP verification for email verification and password reset.
  - Bcrypt password hashing and AES-256 data encryption support.

- **🏪 Coffee Shop Management:**
  - Shop creation with Cloudinary image upload (Multer integration).
  - Shop opening/closing hours per day with customizable status.
  - Unique QR code generation for shops (`HH-SHOP-XXXXXX`).
  - Search, filtering, and pagination support.

- **💳 Membership & Digital Redemptions:**
  - Customers can join shops directly or by scanning Shop QR codes.
  - Shop Owners can approve, reject, or manage membership requests.
  - Unique Coffee Redemption QR codes (`HH-COFFEE-XXXXXX`).
  - Real-time QR scanning and redemption validation preventing duplicate benefits.

- **📊 Comprehensive Dashboards:**
  - **Admin / Super Admin:** Total shops, total customers, active memberships, and total redemptions.
  - **Shop Owner:** Active customer count, pending membership requests, today's redemptions, and overall shop analytics.

- **📬 Support Tickets & FAQs:**
  - Customer support ticket creation, filtering, reply messaging with automated email notifications, and closure workflows.
  - Categorized FAQ management with active/inactive toggles.

- **🛡️ Enterprise Reliability:**
  - Global rate limiter via `express-rate-limit`.
  - Request logging with `morgan` (combined mode in production, dev mode in development).
  - Unified error handling (`globalErrorHandler`) and centralized 404 responses.
  - Strict input validation using **Zod** schemas across params, query, and body.

---

## 🛠️ System Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Runtime & Language** | [Node.js](https://nodejs.org/) (v20+ LTS), [TypeScript](https://www.typescriptlang.org/) (v6+) |
| **Framework** | [Express.js](https://expressjs.com/) v5 |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) v9 |
| **Validation** | [Zod](https://zod.dev/) v4 |
| **Auth & Security** | JWT (`jsonwebtoken`), `bcryptjs`, `crypto` |
| **File Storage** | [Cloudinary](https://cloudinary.com/) via `multer` |
| **Email Service** | [Nodemailer](https://nodemailer.com/) (SMTP) |
| **Payment Gateway** | [Stripe](https://stripe.com/) |
| **Containerization** | Docker, Docker Compose (Multi-stage build) |

---

## 👥 User Roles & Permissions

| Role | Description & Privileges |
|---|---|
| `super_admin` | Highest privilege; manage admins, owners, global platform settings, view all stats, review support tickets. |
| `admin` | Platform administrator; manage coffee shops, review owner applications, manage FAQs, view system analytics. |
| `owner` | Coffee shop owner; manage shop profiles, opening hours, review customer membership requests, verify redemption QR codes. |
| `customer` | General user; browse shops, join coffee memberships, request redemptions via QR, submit support tickets. |

---

## 📁 Project Structure

```text
coffee-membership-backend/
├── src/
│   ├── app.ts                 # Express app initialization, middleware, routes
│   ├── server.ts              # HTTP server startup & graceful shutdown
│   ├── config/                # Environment variables parsing & Zod schema validation
│   ├── errors/                # Custom AppError classes (BadRequest, NotFound, Unauthorized, etc.)
│   ├── helpers/               # Cloudinary configuration, multer file upload helpers
│   ├── middlewares/           # Auth, rate-limiter, validation, global error handler
│   ├── routes/                # Central route aggregator (/api/v1)
│   ├── schemas/               # Reusable Zod schemas (global, enum, required, boolean)
│   ├── seed/                  # Initial Super Admin database seeding script
│   ├── utils/                 # DB connection, encryption, OTP, email dispatchers, async handler
│   └── modules/               # Domain-driven modular architecture
│       ├── auth/              # Registration, login, password reset, OTP verification
│       ├── content/           # Privacy policy, terms & conditions content management
│       ├── dashboard/         # Aggregated metrics for Admin and Owner
│       ├── faq/               # Frequently asked questions management
│       ├── membership/        # Membership lifecycle (request, approve, cancel)
│       ├── openingHour/       # Weekly shop opening & closing hours
│       ├── owner/             # Shop owner CRUD and admin assignments
│       ├── redemption/        # QR generation, scanning, and redemption history
│       ├── session/           # User multi-session tracking & revocation
│       ├── shop/              # Coffee shop profiles, locations, and branding
│       ├── support/           # Customer support tickets & reply dispatcher
│       └── user/              # User profiles, avatar updates, customer directory
├── .dockerignore
├── .env.example
├── docker-compose.yml
├── Dockerfile                 # Multi-stage production Dockerfile (Alpine Node 20)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v20.x or higher)
- **Yarn** (v1.22+ recommended) or **npm**
- **MongoDB** (Local instance or MongoDB Atlas connection string)
- **Docker** and **Docker Compose** (optional, for containerized run)
- **Cloudinary Account** (for image uploads)
- **SMTP credentials** (Gmail App Password or SendGrid/Mailgun)

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Populate the `.env` file with your configuration:

```env
# Application
NODE_ENV=development # development | production
PORT=5050
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/coffee_membership?retryWrites=true&w=majority
BCRPYT_SALT_ROUNDS=12
MAX_SESSIONS=5
ENCRYPTION_KEY=your_32_characters_secret_key!
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT Secret & Expirations
JWT_VERIFY_EMAIL_SECRET=your_jwt_verify_email_secret
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_VERIFY_EMAIL_EXPIRES_IN=10m
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN_REMEMBER=30d

# Refresh Token Cookie (in milliseconds)
REFRESH_TOKEN_COOKIE_MAX_AGE=604800000          # 7 days
REFRESH_TOKEN_COOKIE_MAX_AGE_REMEMBER=2592000000 # 30 days

# SMTP Email Configuration
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_16_digit_app_password
SMTP_FROM=Coffee Membership <your_email@gmail.com>

# Super Admin Initial Credentials (Used during seeding)
SUPER_ADMIN_EMAIL=your_super_admin_email
SUPER_ADMIN_PHONE_NUMBER=your_super_admin_phone_number
SUPER_ADMIN_PASSWORD=your_super_admin_password
ADMIN_DEFAULT_PASSWORD=your_admin_default_password
OWNER_DEFAULT_PASSWORD=your_owner_default_password

# Cloudinary (Media uploads)
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET_KEY=your_cloudinary_api_secret_key

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

---

## 🌱 Database Seeding

To create the initial **Super Admin** account in MongoDB, run:

```bash
yarn seed
```

This checks if a `super_admin` exists, and if not, automatically seeds the database using the credentials specified in your `.env` file.

---

## 🚀 How to Run

### 1. Using Docker Compose (Recommended)

Run the backend application inside an isolated Docker container with one command:

```bash
# Build and run container in detached mode
docker compose up -d --build

# View real-time logs
docker compose logs -f

# Stop and remove containers & networks
docker compose down
```

### 2. Using Standalone Docker

```bash
# Build Docker image
docker build -t coffee-membership-backend .

# Run container with environment file
docker run -d --name coffee_membership_api -p 5050:5050 --env-file .env coffee-membership-backend

# Check container logs
docker logs -f coffee_membership_api

# Stop and remove
docker stop coffee_membership_api && docker rm coffee_membership_api
```

### 3. Local Development (Without Docker)

```bash
# 1. Install dependencies
yarn install

# 2. Run TypeScript build verification
yarn build

# 3. Start local development server with hot-reload (tsx)
yarn dev

# 4. Start production server (from dist)
yarn start
```

---

## 🌐 API Reference

Base API URL: `http://localhost:5050/api/v1`

### 🔑 Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new customer account |
| `POST` | `/auth/login` | Public | Login with email & password |
| `POST` | `/auth/verify-email` | Public | Verify account email using OTP |
| `POST` | `/auth/resend-verify-email` | Public | Resend email verification OTP |
| `POST` | `/auth/forgot-password` | Public | Request password reset OTP |
| `POST` | `/auth/verify-forgot-password-otp` | Public | Validate forgot password OTP |
| `POST` | `/auth/reset-password` | Public | Reset password with verified token |
| `POST` | `/auth/change-password` | Authenticated | Change current account password |
| `POST` | `/auth/refresh-token` | Public | Refresh JWT access token via cookie |
| `POST` | `/auth/logout` | Authenticated | Logout current session |
| `POST` | `/auth/logout-all` | Authenticated | Revoke all active user sessions |

### 👤 User Management (`/api/v1/user`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/user/my-profile` | Authenticated | Retrieve authenticated user profile |
| `PATCH` | `/user/update-profile` | Authenticated | Update profile details and upload avatar |
| `GET` | `/user/customers` | Admin, Super Admin | Paginated list of all platform customers |
| `GET` | `/user/customers/:shopId` | Admin, Super Admin | Customers affiliated with a specific shop |
| `GET` | `/user/my-customers` | Owner | List of members for the owner's coffee shop |

### 🏢 Shop Owners (`/api/v1/owner`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/owner/create-owner` | Super Admin | Create a new shop owner account |
| `GET` | `/owner/get-owners` | Admin, Super Admin | Retrieve paginated list of shop owners |
| `PATCH` | `/owner/update-owner/:ownerId` | Super Admin | Update shop owner account status/details |
| `DELETE` | `/owner/delete-owner/:ownerId` | Super Admin | Remove an owner account |

### ☕ Coffee Shops (`/api/v1/shop`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/shop/create-shop` | Owner | Create coffee shop profile with banner/image |
| `GET` | `/shop/get-shops` | Admin, Super Admin | Get all registered shops with status filter |
| `GET` | `/shop/customer-shops` | Customer | Browse approved active shops |
| `GET` | `/shop/:shopId` | Public | Get single shop details and operating hours |
| `PATCH` | `/shop/update-shop/:shopId` | Owner | Update coffee shop information |
| `PATCH` | `/shop/update-status/:shopId` | Admin, Super Admin | Approve, reject, or suspend a shop |

### ⏰ Opening Hours (`/api/v1/opening-hour`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/opening-hour/create` | Owner | Define opening and closing hours |
| `GET` | `/opening-hour/:shopId` | Public | Get operating schedule for a shop |
| `PATCH` | `/opening-hour/update/:shopId` | Owner | Modify shop opening schedule |

### 🎫 Membership (`/api/v1/membership`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/membership/join-shop` | Customer | Submit request to join a shop's membership |
| `POST` | `/membership/join-with-qr` | Customer | Join coffee membership by scanning shop QR |
| `GET` | `/membership/my-memberships` | Customer | View customer's active memberships |
| `GET` | `/membership/requests` | Owner | View pending membership applications |
| `PATCH` | `/membership/update-status/:id` | Owner | Approve or reject a membership request |

### 🏷️ Redemptions (`/api/v1/redemption`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/redemption/generate-qr` | Customer | Generate daily coffee redemption QR code |
| `POST` | `/redemption/redeem` | Owner | Scan customer QR code to validate redemption |
| `GET` | `/redemption/history` | Customer, Owner | View historical redemption activity logs |

### 📊 Dashboard Analytics (`/api/v1/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/dashboard/stats` | Admin, Super Admin | Global platform metrics and counts |
| `GET` | `/dashboard/owner-stats` | Owner | Shop-specific customer, request & redemption analytics |

### ❓ FAQs (`/api/v1/faq`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/faq` | Public | List published active FAQs by category |
| `GET` | `/faq/faqs` | Admin, Super Admin | View all FAQs (including inactive) |
| `POST` | `/faq/create-faq` | Admin, Super Admin | Add new FAQ |
| `PATCH` | `/faq/update-faq/:faqId` | Admin, Super Admin | Edit FAQ question, answer, or status |
| `DELETE` | `/faq/delete-faq/:faqId` | Admin, Super Admin | Delete an FAQ entry |

### 💬 Support Tickets (`/api/v1/support`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/support/submit` | Customer | Open a new customer support ticket |
| `GET` | `/support/all` | Admin, Super Admin | View and filter all support requests |
| `PATCH` | `/support/reply/:supportId` | Admin, Super Admin | Send reply to customer (dispatches email) |
| `PATCH` | `/support/close/:supportId` | Admin, Super Admin | Mark support ticket as closed |
| `DELETE` | `/support/delete/:supportId` | Admin, Super Admin | Delete a support record |

### 📄 Static Content (`/api/v1/content`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/content` | Public | Retrieve Terms & Conditions or Privacy Policy |
| `POST` | `/content` | Admin, Super Admin | Create or update legal content pages |

---

## 🔒 Security & Best Practices

- **Strict Input Validation:** Every incoming request payload (params, query, and body) is validated using custom **Zod** schemas.
- **DDoS & Brute-force Protection:** `express-rate-limit` throttles excessive requests across `/api/v1` routes.
- **Secure Password Hashing:** Powered by `bcryptjs` with configurable salt rounds (default: 12).
- **Least-Privilege Docker Execution:** Production container runs under a non-root `node` user.
- **Environment Isolation:** Sensitive files (`.env`, `.git`) are strictly excluded via `.dockerignore`.
- **Structured Error Responses:** Errors are normalized into consistent JSON formats across the entire API:
  ```json
  {
    "success": false,
    "message": "Error description message",
    "errorSources": [
      {
        "path": "field",
        "message": "Field is required"
      }
    ],
    "stack": null
  }
  ```

---

## 📜 Available Scripts

In the project root, you can execute:

| Command | Action |
|---|---|
| `yarn dev` | Starts server with live reload via `tsx watch` |
| `yarn build` | Compiles TypeScript and resolves `@/` paths via `tsc && tsc-alias` |
| `yarn start` | Runs the compiled output in `dist/server.js` using `nodemon` |
| `yarn seed` | Seeds the initial Super Admin account into MongoDB |
| `yarn lint` | Runs ESLint syntax and code quality checks |
| `yarn lint:fix` | Automatically fixes auto-resolvable ESLint issues |

---

## 📄 License

This project is licensed under the **ISC License**.
