// frontend/src/components/TransactionList.tsx
import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';
import { Transaction } from '../types'; // Make sure path is correct

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (err) {
         console.error("Failed to fetch transactions:", err);
         setError("Failed to load transactions. Are you logged in?");
         // Handle specific errors like 401 if needed
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []); // Fetch on component mount

  if (isLoading) {
    return <p>Loading transactions...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (transactions.length === 0) {
      return <p>No transactions found.</p>
  }

  // Helper to format date string
  const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString(); // Adjust formatting as needed
    } catch {
        return "Invalid Date";
    }
  };

  return (
    <div className="transaction-list">
      <h3>Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{formatDate(tx.date)}</td>
              <td>{tx.description}</td>
              <td>{tx.type}</td>
              <td style={{ color: tx.type === 'EXPENSE' ? 'red' : 'green' }}>
                {tx.amount.toFixed(2)} {/* Format amount */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;