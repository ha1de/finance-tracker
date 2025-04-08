import axios from 'axios';
import { Transaction, User, TransactionType } from '../types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export const getHealth = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error("Error fetching health status:", error);
    throw error;
  }
};



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
    const response = await apiClient.post<{ message: string, user: User }>('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    localStorage.removeItem('authToken');
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};



export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await apiClient.get<Transaction[]>('/transactions');
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
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
    throw error;
  }
};

// Allows partial updates to transaction fields
type UpdateTransactionData = Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>;

export const updateTransaction = async (id: number, transactionData: UpdateTransactionData): Promise<Transaction> => {
  try {
    const response = await apiClient.put<Transaction>(`/transactions/${id}`, transactionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating transaction ${id}:`, error);
    throw error;
  }
};

export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/transactions/${id}`);
  } catch (error) {
    console.error(`Error deleting transaction ${id}:`, error);
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
};

export default apiClient;
