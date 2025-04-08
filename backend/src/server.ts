// backend/src/server.ts
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config'; // Load config first
import apiRoutes from './routes'; // Import the main router
import { errorHandler } from './middleware/errorHandler'; // Import error handler



// --- Initialize Express App ---
const app: Express = express();

// --- Middleware ---
// Enable CORS for all origins (adjust in production!)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
// Mount the main API router under '/api' prefix
app.use('/api', apiRoutes);

// --- Basic Welcome Route ---
app.get('/', (req: Request, res: Response) => {
  res.send('Finance Tracker Backend API is running!');
});

// --- Error Handling Middleware ---
// This should be the LAST middleware added
app.use(errorHandler);

// --- Start Server ---
const port = config.port;
app.listen(port, () => {
  console.log(`[server]: Backend server is running at http://localhost:${port}`);
  console.log(`[server]: API available at http://localhost:${port}/api`);
});

// Optional: Handle graceful shutdown (e.g., close Prisma client)
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server')
    // Add cleanup logic if needed (e.g., await prisma.$disconnect())
    process.exit(0)
})

process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server')
    // Add cleanup logic if needed (e.g., await prisma.$disconnect())
    process.exit(0)
})