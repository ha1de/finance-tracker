// backend/src/config/index.ts
import dotenv from 'dotenv';

dotenv.config(); // Load variables from .env file

export const config = {
  port: process.env.PORT || 3001,
  jwt: {
    secret: process.env.JWT_SECRET || 'DEFAULT_SECRET', // Fallback is insecure, ensure .env is set
    expiresIn: '1d', // Token expiry time
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10), // Default to 10 rounds
  },
  databaseUrl: process.env.DATABASE_URL, // For Prisma
};

if (!config.databaseUrl) {
  console.error("FATAL ERROR: DATABASE_URL is not defined in .env");
  process.exit(1);
}
if (config.jwt.secret === 'DEFAULT_SECRET') {
    console.warn("WARNING: JWT_SECRET is using a default value. Set it in .env for security.");
}