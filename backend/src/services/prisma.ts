// backend/src/services/prisma.ts
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient({
  // Optional: Add logging configuration if needed during development
  // log: ['query', 'info', 'warn', 'error'],
});

export default prisma;