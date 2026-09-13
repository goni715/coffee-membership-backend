# Coffee Membership Backend

Backend API service for the Coffee Membership application, built with Node.js, Express, TypeScript, and MongoDB.

---

## 🛠️ Tech Stack

- **Runtime & Language:** Node.js (v20+), TypeScript
- **Framework:** Express.js 5
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication & Security:** JWT, bcryptjs
- **Media Storage:** Cloudinary, Multer
- **Payment Processing:** Stripe
- **Email Service:** Nodemailer
- **Containerization:** Docker & Docker Compose

---

## 📋 Prerequisites

Before getting started, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20.x or higher)
- [Yarn](https://yarnpkg.com/) or `npm`
- [Docker](https://www.docker.com/) & Docker Compose (for containerized deployment)
- A running MongoDB instance (or MongoDB Atlas cluster URI)

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory and configure the required environment variables:

```env
NODE_ENV=your_node_env # development, production
PORT=your_port # 5050 is recommended
DATABASE_URL=your_database_url
BCRPYT_SALT_ROUNDS=your_salt_rounds # 12 is recommended
ENCRYPTION_KEY=your_encryption_key # 32 characters
CORS_ORIGINS=your_cors_origins # comma separated values
MAX_SESSIONS=your_max_sessions # number of sessions

# SMTP Email Configuration
SMTP_USERNAME=your_smtp_username # example@gmail.com
SMTP_PASSWORD=your_smtp_password # 16 digit app password
SMTP_FROM=your_smtp_from # <example@gmail.com>

# JWT Configuration
JWT_VERIFY_EMAIL_SECRET=your_jwt_verify_email_secret
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_VERIFY_EMAIL_EXPIRES_IN=your_jwt_verify_email_expires_in # minutes
JWT_ACCESS_EXPIRES_IN=your_jwt_access_expires_in # days
JWT_REFRESH_EXPIRES_IN=your_jwt_refresh_expires_in # days
JWT_REFRESH_EXPIRES_IN_REMEMBER=your_jwt_refresh_expires_in_remember # days

# Refresh Token Cookie
REFRESH_TOKEN_COOKIE_MAX_AGE=your_refresh_token_cookie_max_age # miliseconds
REFRESH_TOKEN_COOKIE_MAX_AGE_REMEMBER=your_refresh_token_cookie_max_age_remember # miliseconds

# Admin Defaults
SUPER_ADMIN_EMAIL=your_super_admin_email
SUPER_ADMIN_PHONE_NUMBER=your_super_admin_phone_number
SUPER_ADMIN_PASSWORD=your_super_admin_password
ADMIN_DEFAULT_PASSWORD=your_admin_default_password
OWNER_DEFAULT_PASSWORD=your_owner_default_password

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET_KEY=your_cloudinary_api_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

---

## 🚀 How to Run

### Method 1: Using Docker Compose (Recommended)

Run the entire application in a container with a single command:

```bash
# 1. Build and start the container in the background
docker compose up -d --build

# 2. View live logs
docker compose logs -f

# 3. Stop the container
docker compose down
```

---

### Method 2: Using Docker CLI

Build and run the Docker image manually using standard Docker CLI commands:

```bash
# 1. Build the Docker image
docker build -t coffee-membership-backend .

# 2. Run the container with environment variables
docker run -d -p 5050:5050 --env-file .env --name coffee-backend-app coffee-membership-backend

# 3. View container logs
docker logs -f coffee-backend-app

# 4. Stop and remove the container
docker stop coffee-backend-app && docker rm coffee-backend-app
```

---

### Method 3: Local Development (Without Docker)

Run the project directly on your local machine:

```bash
# 1. Install dependencies
yarn install
# or: npm install

# 2. Start the development server (with hot-reload)
yarn dev
# or: npm run dev

# 3. Build for production
yarn build
# or: npm run build

# 4. Run the production build
yarn start
# or: npm run start
```

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| **Development** | `yarn dev` | Starts the server with hot-reloading using `tsx watch` |
| **Build** | `yarn build` | Compiles TypeScript and resolves path aliases via `tsc && tsc-alias` |
| **Start** | `yarn start` | Starts the compiled production server using `nodemon ./dist/server.js` |
| **Seed** | `yarn seed` | Seeds initial data into the MongoDB database |
| **Lint** | `yarn lint` | Checks code quality and syntax with ESLint |
| **Lint Fix** | `yarn lint:fix` | Automatically fixes ESLint issues |

---

## 🌐 Server Endpoints

- **Base URL:** `http://localhost:5050`
- Once running, you should see the following startup log:
  ```
  Coffee Membership Back-end listening on port http://localhost:5050
  ```
