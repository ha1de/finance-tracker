import React, { useState, useEffect } from 'react';
import { addTransaction, updateTransaction } from '../services/api';
import { Transaction, TransactionType } from '../types';
import { AxiosError } from 'axios';

interface AddTransactionFormProps {
  onSaveSuccess: () => void;
  transactionToEdit?: Transaction | null;
  onCancelEdit?: () => void;
}

interface FormData {
  description: string;
  amount: string;
  type: TransactionType;
  date: string;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onSaveSuccess, transactionToEdit = null, onCancelEdit }) => {
  const isEditMode = transactionToEdit !== null;

  const [formData, setFormData] = useState<FormData>({
    description: '',
    amount: '',
    type: TransactionType.EXPENSE,
    date: new Date().toISOString().split('T')[0],
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && transactionToEdit) {
      setFormData({
        description: transactionToEdit.description,
        amount: transactionToEdit.amount.toString(),
        type: transactionToEdit.type,
        date: transactionToEdit.date.split('T')[0],
      });
      setError(null);
      setSuccess(null);
    } else {
      setFormData({
        description: '',
        amount: '',
        type: TransactionType.EXPENSE,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [transactionToEdit, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description.');
      return;
    }

    setIsLoading(true);

    const transactionDataPayload = {
      description: formData.description.trim(),
      amount: parsedAmount,
      type: formData.type,
      date: formData.date,
    };

    try {
      if (isEditMode && transactionToEdit) {
        await updateTransaction(transactionToEdit.id, transactionDataPayload);
        setSuccess('Transaction updated successfully!');
      } else {
        await addTransaction(transactionDataPayload);
        setSuccess('Transaction added successfully!');
      }

      onSaveSuccess();
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} transaction.`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleCancel = () => {
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className={`add-transaction-form card ${isEditMode ? 'editing' : ''}`}>
      <h3>{isEditMode ? `Edit Transaction (ID: ${transactionToEdit?.id})` : 'Add New Transaction'}</h3>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <input id="description" name="description" type="text" value={formData.description} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Amount:</label>
        <input id="amount" name="amount" type="number" step="0.01" min="0.01" value={formData.amount} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="type">Type:</label>
        <select id="type" name="type" value={formData.type} onChange={handleChange} required>
          <option value={TransactionType.EXPENSE}>Expense</option>
          <option value={TransactionType.INCOME}>Income</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
      </div>

      <div style={{ display: 'flex', justifyContent: isEditMode ? 'space-between' : 'flex-end', alignItems: 'center' }}>
        {isEditMode && <button type="button" onClick={handleCancel} disabled={isLoading} style={{ backgroundColor: '#6c757d' }}>Cancel Edit</button>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Transaction')}
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
