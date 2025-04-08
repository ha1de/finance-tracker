import React, { useRef, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import '../App.css';

interface TransactionListProps {
    transactions: Transaction[];
    isLoading: boolean;
    selectedTransactionIds: Set<number>;
    onSelectTransaction: (id: number) => void;
    isAllSelected: boolean;
    onSelectAllChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
    transactions,
    isLoading,
    selectedTransactionIds,
    onSelectTransaction,
    isAllSelected,
    onSelectAllChange
}) => {
    const headerCheckboxRef = useRef<HTMLInputElement>(null);

    // Effect to handle indeterminate and checked states of "Select All" checkbox
    useEffect(() => {
        if (headerCheckboxRef.current) {
            const numSelected = selectedTransactionIds.size;
            const numTotal = transactions.length;
            headerCheckboxRef.current.indeterminate = numTotal > 0 && numSelected > 0 && numSelected < numTotal;
            headerCheckboxRef.current.checked = numTotal > 0 && isAllSelected;
        }
    }, [selectedTransactionIds, transactions, isAllSelected]);

    // Format date for table
    const formatDate = (date: string) => new Date(date).toLocaleDateString();

    return (
        <div className="transaction-list-scrollable">
            <table>
                <thead>
                    <tr>
                        <th>
                            <input
                                ref={headerCheckboxRef}
                                type="checkbox"
                                onChange={onSelectAllChange}
                                disabled={isLoading || !transactions.length}
                            />
                        </th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && <tr><td colSpan={5}>Loading...</td></tr>}
                    {!isLoading && !transactions.length && <tr><td colSpan={5}>No transactions found.</td></tr>}
                    {!isLoading && transactions.map(tx => (
                        <tr key={tx.id} className={selectedTransactionIds.has(tx.id) ? 'selected-row' : ''}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedTransactionIds.has(tx.id)}
                                    onChange={() => onSelectTransaction(tx.id)}
                                />
                            </td>
                            <td>{formatDate(tx.date)}</td>
                            <td>{tx.description}</td>
                            <td>{tx.type}</td>
                            <td className={tx.type === TransactionType.EXPENSE ? 'expense-amount' : 'income-amount'}>
                                {tx.type === TransactionType.EXPENSE ? '-' : '+'}${tx.amount.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionList;
