// frontend/src/services/api.ts
import axios from 'axios';
import { Transaction, User } from '../types'; // Import User type if not already

// Create an Axios instance configured for our API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Get base URL from .env
  timeout: 10000, // Optional: Set request timeout (10 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Add Auth Token Interceptor (Important for protected routes!) ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Example key name
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- API functions ---

// Health Check
export const getHealth = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error("Error fetching health status:", error);
    throw error;
  }
};

// --- Authentication ---
// Define types for request/response data explicitly
interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

interface RegisterData {
    email: string;
    password: string;
    name?: string;
}

interface LoginData {
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterData): Promise<{ message: string, user: User }> => {
    try {
        // Note: Backend currently doesn't return token on register, adjust if needed
        const response = await apiClient.post<{ message: string, user: User }>('/auth/register', data);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error; // Re-throw to be handled by the component
    }
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        // Store the token upon successful login
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token); // Store the token
            console.log("Token stored in localStorage");
        } else {
             console.warn("No token received from login response");
        }
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        // Remove any potentially stale token on login failure
        localStorage.removeItem('authToken');
        throw error; // Re-throw
    }
};

export const getCurrentUser = async (): Promise<User> => {
    try {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    } catch (error) {
        console.error("Error fetching current user:", error);
        // If error (e.g., 401), token might be invalid/expired
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log("Unauthorized fetching user, removing token.");
            localStorage.removeItem('authToken');
        }
        throw error;
    }
};

// --- Transactions ---
export const getTransactions = async (): Promise<Transaction[]> => {
    try {
        const response = await apiClient.get<Transaction[]>('/transactions');
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
         if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log("Unauthorized fetching transactions, removing token.");
            localStorage.removeItem('authToken');
        }
        throw error;
    }
};

type NewTransactionData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

export const addTransaction = async (transactionData: NewTransactionData): Promise<Transaction> => {
    try {
        const response = await apiClient.post<Transaction>('/transactions', transactionData);
        return response.data;
    } catch (error) {
        console.error("Error adding transaction:", error);
         if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log("Unauthorized adding transaction, removing token.");
            localStorage.removeItem('authToken');
        }
        throw error;
    }
};

// --- Logout Helper ---
export const logout = (): void => {
    localStorage.removeItem('authToken');
    console.log("Token removed from localStorage");
    // Optionally redirect or update app state here or in the component calling logout
};


// TODO: Add Update/Delete Transaction functions

export default apiClient;