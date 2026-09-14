"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production"]).default('development'),
    PORT: zod_1.z.string().default('5050'),
    DATABASE_URL: zod_1.z.string(),
    BCRPYT_SALT_ROUNDS: zod_1.z.string(),
    ENCRYPTION_KEY: zod_1.z.string(),
    CORS_ORIGINS: zod_1.z.string(),
    MAX_SESSIONS: zod_1.z.string(),
    // SMTP
    SMTP_USERNAME: zod_1.z.string(),
    SMTP_PASSWORD: zod_1.z.string(),
    SMTP_FROM: zod_1.z.string(),
    // JWT
    JWT_VERIFY_EMAIL_SECRET: zod_1.z.string(),
    JWT_ACCESS_SECRET: zod_1.z.string(),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    JWT_VERIFY_EMAIL_EXPIRES_IN: zod_1.z.string(),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string(),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string(),
    JWT_REFRESH_EXPIRES_IN_REMEMBER: zod_1.z.string(),
    // Refresh Token
    REFRESH_TOKEN_COOKIE_MAX_AGE: zod_1.z.string(),
    REFRESH_TOKEN_COOKIE_MAX_AGE_REMEMBER: zod_1.z.string(),
    // Admin
    SUPER_ADMIN_EMAIL: zod_1.z.string(),
    SUPER_ADMIN_PHONE_NUMBER: zod_1.z.string(),
    SUPER_ADMIN_PASSWORD: zod_1.z.string(),
    ADMIN_DEFAULT_PASSWORD: zod_1.z.string(),
    OWNER_DEFAULT_PASSWORD: zod_1.z.string(),
    // Cloudinary
    CLOUD_NAME: zod_1.z.string(),
    CLOUD_API_KEY: zod_1.z.string(),
    CLOUD_API_SECRET_KEY: zod_1.z.string(),
    // Stripe
    STRIPE_SECRET_KEY: zod_1.z.string(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string(),
});
// Validate process.env against schema
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    const formattedErrors = {};
    parsedEnv.error.issues.forEach((e) => {
        if (e.path.length > 0) {
            formattedErrors[e.path.join(".")] = e.message;
        }
    });
    console.error("❌ Invalid environment variables:", JSON.stringify(formattedErrors, null, 2));
    throw new Error("Invalid environment variables");
}
const env = parsedEnv.data;
exports.default = {
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
        jwt_refresh_expires_in_remember: env.JWT_REFRESH_EXPIRES_IN_REMEMBER,
    },
    refreshToken: {
        refresh_token_cookie_max_age: env.REFRESH_TOKEN_COOKIE_MAX_AGE,
        refresh_token_cookie_max_age_remember: env.REFRESH_TOKEN_COOKIE_MAX_AGE_REMEMBER,
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
