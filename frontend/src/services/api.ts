// frontend/src/services/api.ts
import axios from 'axios';
import { Transaction } from '../types'; // Import your types

// Create an Axios instance configured for our API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Get base URL from .env
  timeout: 10000, // Optional: Set request timeout (10 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Add Auth Token Interceptor (Important for protected routes!) ---
// This interceptor runs before each request
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from wherever you store it (e.g., localStorage)
    const token = localStorage.getItem('authToken'); // Example key name
    if (token) {
      // If token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Continue with the request configuration
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);


// --- Define API functions ---

// Example: Get backend health status
export const getHealth = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error("Error fetching health status:", error);
    // Re-throw or handle error as appropriate for your app
    throw error;
  }
};

// Example: Get all transactions (needs authentication)
export const getTransactions = async (): Promise<Transaction[]> => {
    try {
        const response = await apiClient.get<Transaction[]>('/transactions'); // Expect an array of Transactions
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        // Handle potential 401 Unauthorized errors etc.
        throw error;
    }
};

// Example: Add a new transaction (needs authentication)
// Omit 'id', 'createdAt', 'updatedAt', 'userId' as they are set by backend/token
type NewTransactionData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

export const addTransaction = async (transactionData: NewTransactionData): Promise<Transaction> => {
    try {
        const response = await apiClient.post<Transaction>('/transactions', transactionData);
        return response.data;
    } catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
    }
};

// TODO: Add functions for:
// - Register (/auth/register)
// - Login (/auth/login) -> Store the received token (e.g., in localStorage)
// - Get Current User (/auth/me)
// - Update Transaction (/transactions/:id) PUT/PATCH
// - Delete Transaction (/transactions/:id) DELETE

export default apiClient; // Optional: Export the configured client if needed elsewhere