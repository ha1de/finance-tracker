export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
  }
  
  export interface Transaction {
    id: number;
    description: string;
    amount: number;
    type: TransactionType;
    date: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
  }
  
  export interface User {
    id: number;
    email: string;
    name?: string | null;
  }
  