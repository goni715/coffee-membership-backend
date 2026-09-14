import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default('development'),
  PORT: z.string().default('5050'),
  DATABASE_URL: z.string(),
  BCRPYT_SALT_ROUNDS: z.string(),
  ENCRYPTION_KEY: z.string(),
  CORS_ORIGINS: z.string(),
  MAX_SESSIONS: z.string(),

  // SMTP
  SMTP_USERNAME: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_FROM: z.string(),

  // JWT
  JWT_VERIFY_EMAIL_SECRET: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_VERIFY_EMAIL_EXPIRES_IN: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN_REMEMBER: z.string(),

  // Refresh Token
  REFRESH_TOKEN_COOKIE_MAX_AGE: z.string(),
  REFRESH_TOKEN_COOKIE_MAX_AGE_REMEMBER: z.string(),

  // Admin
  SUPER_ADMIN_EMAIL: z.string(),
  SUPER_ADMIN_PHONE_NUMBER: z.string(),
  SUPER_ADMIN_PASSWORD: z.string(),
  ADMIN_DEFAULT_PASSWORD: z.string(),
  OWNER_DEFAULT_PASSWORD: z.string(),

  // Cloudinary
  CLOUD_NAME: z.string(),
  CLOUD_API_KEY: z.string(),
  CLOUD_API_SECRET_KEY: z.string(),

  // Stripe
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
});

// Validate process.env against schema
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formattedErrors: Record<string, string> = {};
  parsedEnv.error.issues.forEach((e) => {
    if (e.path.length > 0) {
      formattedErrors[e.path.join(".")] = e.message;
    }
  });

  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(formattedErrors, null, 2),
  );
  throw new Error("Invalid environment variables");
}

const env = parsedEnv.data;

export default {
  node_env: env.NODE_ENV,
  port: env.PORT,
  database_url: env.DATABASE_URL,
  bcrypt_salt_rounds: env.BCRPYT_SALT_ROUNDS,
  encryption_key: env.ENCRYPTION_KEY,
  cors_origins: env.CORS_ORIGINS,
  max_sessions: env.MAX_SESSIONS,
  smtp: {
    smtp_username: env.SMTP_USERNAME,
    smtp_password: env.SMTP_PASSWORD,
    smtp_from: env.SMTP_FROM,
  },
  jwt: {
    jwt_verify_email_secret: env.JWT_VERIFY_EMAIL_SECRET,
    jwt_access_secret: env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: env.JWT_REFRESH_SECRET,
    jwt_verify_email_expires_in: env.JWT_VERIFY_EMAIL_EXPIRES_IN,
    jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN,
    jwt_refresh_expires_in_remember:
      env.JWT_REFRESH_EXPIRES_IN_REMEMBER,
  },
  refreshToken: {
    refresh_token_cookie_max_age: env.REFRESH_TOKEN_COOKIE_MAX_AGE,
    refresh_token_cookie_max_age_remember:
      env.REFRESH_TOKEN_COOKIE_MAX_AGE_REMEMBER,
  },
  admin: {
    super_admin_email: env.SUPER_ADMIN_EMAIL,
    super_admin_phone_number: env.SUPER_ADMIN_PHONE_NUMBER,
    super_admin_password: env.SUPER_ADMIN_PASSWORD,
    admin_default_password: env.ADMIN_DEFAULT_PASSWORD,
    owner_default_password: env.OWNER_DEFAULT_PASSWORD,
  },
  cloudinary: {
    cloud_name: env.CLOUD_NAME,
    cloud_api_key: env.CLOUD_API_KEY,
    cloud_api_secret_key: env.CLOUD_API_SECRET_KEY,
  },
  stripe: {
    stripe_secret_key: env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: env.STRIPE_WEBHOOK_SECRET,
  },
};
