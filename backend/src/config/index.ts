import dotenv from 'dotenv';

dotenv.config(); 

export const config = {
  port: process.env.PORT || 3001,  
  jwt: {
    secret: process.env.JWT_SECRET || 'DEFAULT_SECRET',  // Fallback secret (insecure, should be set in .env)
    expiresIn: '1d', // JWT expiration time
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),  
  },
  databaseUrl: process.env.DATABASE_URL, 
};

// Check if critical environment variables are missing
if (!config.databaseUrl) {
  console.error("FATAL ERROR: DATABASE_URL is not defined in .env");
  process.exit(1);
}

if (config.jwt.secret === 'DEFAULT_SECRET') {
    console.warn("WARNING: JWT_SECRET is using a default value. Set it in .env for security.");
}
