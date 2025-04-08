// backend/src/types/express.d.ts

// Extend the Express Request interface to include our custom 'user' property
declare global {
    namespace Express {
      export interface Request {
        user?: { // Make user optional as it's only present after auth middleware
          id: number;
          email: string;
          // Add other relevant user properties you might need from the token payload
        };
      }
    }
  }
  
  // Export {} to make this file a module (important for declaration merging)
  export {};