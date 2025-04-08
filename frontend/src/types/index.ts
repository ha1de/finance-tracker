// frontend/src/types/index.ts

// Must match the enum defined in Prisma!
export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
  }
  
  export interface Transaction {
    id: number;
    description: string;
    amount: number;
    type: TransactionType;
    date: string; // Dates often come as ISO strings from APIs
    createdAt: string;
    updatedAt: string;
    userId: number;
  }
  
  // Add other types here as needed (e.g., User)
  export interface User {
     id: number;
     email: string;
     name?: string | null; // Match Prisma optional field
  }