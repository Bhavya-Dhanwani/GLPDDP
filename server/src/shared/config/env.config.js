// Importing moduels
import { config } from 'dotenv';
import z from 'zod/v4';
import envsConstants from '../constants/env.constants.js';

// Load environment variables from .env file and set debug/quiet mode based on NODE_ENV
config({
    path: process.cwd() + '/.env',
    debug: process.env.NODE_ENV === 'development' ? true : false,
    quiet: process.env.NODE_ENV === 'production' ? true : false
});

// Define a schema for environment variables using zod
const envSchema = z.object({
    PORT: z.coerce.number().default(envsConstants.PORT),
    NODE_ENV: z.enum(['development', 'production', 'test']).default(envsConstants.NODE_ENV),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default(envsConstants.LOG_LEVEL),
    API_LIMIT: z.coerce.number().default(envsConstants.API_LIMIT),
    FRONTEND_URL: z.string().default(envsConstants.FRONTEND_URL),
    MONGO_URI: z.string().default(envsConstants.MONGO_URI),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    SMTP_USER: z.string(),
    SMTP_PASS: z.string(),
    SMTP_SERVICE: z.string(),
    SMTP_PORT: z.coerce.number(),
    TRANSACTIONAL_EMAIL: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REDIRECT_URI: z.string().default("http://localhost:5000/api/auth/google/callback"),
    IMAGEKIT_PUBLIC_KEY: z.string().optional(),
    IMAGEKIT_PRIVATE_KEY: z.string().optional(),
    IMAGEKIT_URL_ENDPOINT: z.string().optional()
}).strip(); // Strip out any extra environment variables that are not defined in the schema

// Validate environment variables
const env = envSchema.safeParse(process.env);

// If validation fails, log the errors and exit the process
if (!env.success) {
    console.log('Invalid environment variables:', env.error.flatten());
    // process.exit(1); // Exit with a failure code
}

// Exporting the validated environment variables
export default env.data;
