import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config'; 
import apiRoutes from './routes'; 
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// welcome routingas
app.get('/', (req: Request, res: Response) => {
  res.send('Finance Tracker Backend API is running!');
});

// error handler
app.use(errorHandler);

// start srv
const port = config.port;
app.listen(port, () => {
  console.log(`[server]: Backend server is running at http://localhost:${port}`);
  console.log(`[server]: API available at http://localhost:${port}/api`);
});

// shutdown
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
