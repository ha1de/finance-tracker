import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionList from '../components/TransactionList';
import AddTransactionForm from '../components/AddTransactionForm';
import { getTransactions, logout, deleteTransaction } from '../services/api';
import { Transaction, TransactionType } from '../types';
import '../App.css';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<Set<number>>(new Set());
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Fetch Transactions on Mount 
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  //  Update Select-All checkbox state 
  useEffect(() => {
    const allIds = transactions.map(t => t.id);
    const selectedIds = [...selectedTransactionIds];
    setIsAllSelected(
      allIds.length > 0 &&
      selectedIds.length === allIds.length &&
      selectedIds.every(id => allIds.includes(id))
    );
  }, [transactions, selectedTransactionIds]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveSuccess = () => {
    setTransactionToEdit(null);
    setSelectedTransactionIds(new Set());
    fetchTransactions();
  };

  const handleCancelEdit = () => {
    setTransactionToEdit(null);
  };

  const handleSelectTransaction = (id: number) => {
    setTransactionToEdit(null);
    setSelectedTransactionIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionToEdit(null);
    if (e.target.checked) {
      setSelectedTransactionIds(new Set(transactions.map(t => t.id)));
    } else {
      setSelectedTransactionIds(new Set());
    }
  };

  const selectedTotal = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      if (!selectedTransactionIds.has(tx.id)) return acc;
      return tx.type === TransactionType.INCOME ? acc + tx.amount : acc - tx.amount;
    }, 0);
  }, [transactions, selectedTransactionIds]);

  const handleEditSelected = () => {
    if (selectedTransactionIds.size !== 1) {
      setError('Please select exactly one transaction to edit.');
      setTransactionToEdit(null);
      return;
    }

    const selectedId = Array.from(selectedTransactionIds)[0];
    const transaction = transactions.find(t => t.id === selectedId);

    if (!transaction) {
      setError('Selected transaction not found.');
      setTransactionToEdit(null);
      return;
    }

    setError(null);
    setTransactionToEdit(transaction);
  };

  const handleDeleteSelected = async () => {
    if (selectedTransactionIds.size === 0) {
      setError('Please select transaction(s) to delete.');
      return;
    }

    if (!window.confirm(`Delete ${selectedTransactionIds.size} transaction(s)?`)) return;

    if (transactionToEdit && selectedTransactionIds.has(transactionToEdit.id)) {
      setTransactionToEdit(null);
    }

    setIsLoading(true);
    setError(null);
    let failedDeletes = 0;

    for (const id of selectedTransactionIds) {
      try {
        await deleteTransaction(id);
      } catch (err) {
        console.error(`Failed to delete transaction ${id}:`, err);
        failedDeletes++;
      }
    }

    setSelectedTransactionIds(new Set());
    if (failedDeletes > 0) {
      setError(`Failed to delete ${failedDeletes} transaction(s). Check console.`);
    }

    fetchTransactions();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-container">
        <section className="add-transaction-section">
          <AddTransactionForm
            key={transactionToEdit ? transactionToEdit.id : 'add'}
            transactionToEdit={transactionToEdit}
            onSaveSuccess={handleSaveSuccess}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        <section className="transaction-history-section">
          <h3>Transaction History</h3>
          {error && <p className="error-message">{error}</p>}

          <div className={`action-buttons-container ${selectedTransactionIds.size > 0 ? 'active' : ''}`}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleEditSelected}
                disabled={selectedTransactionIds.size !== 1 || isLoading || !!transactionToEdit}
              >
                Edit Selected
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={isLoading || !!transactionToEdit}
              >
                Delete Selected ({selectedTransactionIds.size})
              </button>
            </div>
          </div>

          <TransactionList
            transactions={transactions}
            isLoading={isLoading}
            selectedTransactionIds={selectedTransactionIds}
            onSelectTransaction={handleSelectTransaction}
            isAllSelected={isAllSelected}
            onSelectAllChange={handleSelectAllChange}
          />

          {selectedTransactionIds.size > 0 && !transactionToEdit && (
            <div style={{ marginTop: '1rem', fontWeight: 'bold', textAlign: 'right' }}>
              Selected Total: ${selectedTotal.toFixed(2)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
