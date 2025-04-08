declare global {
    namespace Express {
      export interface Request {
        user?: { // Make user optional, only present after auth middleware
          id: number;
          email: string;
        };
      }
    }
  }
  
  export {};
  