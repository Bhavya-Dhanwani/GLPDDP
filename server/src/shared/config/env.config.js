// Importing moduels
import { config } from 'dotenv';
import z from 'zod/v4';
import envsConstants from '../constants/db.constants.js';

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
    DB_URI: z.string().default(envsConstants.DB_URI),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default(envsConstants.LOG_LEVEL),
    API_LIMIT: z.coerce.number().default(envsConstants.API_LIMIT),
    FRONTEND_URL: z.string().default(envsConstants.FRONTEND_URL)
}).strip(); // Strip out any extra environment variables that are not defined in the schema

// Validate environment variables
const env = envSchema.safeParse(process.env);

// If validation fails, log the errors and exit the process
if (!env.success) {
    logger.error('Invalid environment variables:', env.error.flatten());
    process.exit(1); // Exit with a failure code
}

// Exporting the validated environment variables
export default env.data;