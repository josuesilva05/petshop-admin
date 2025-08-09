import { useState, useEffect } from 'react';
import { transactionsApi } from '../api';
import type { Transacao } from '@/lib/types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionsApi.getAll();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar transações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
}

export function useTransaction(id: number) {
  const [transaction, setTransaction] = useState<Transacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const data = await transactionsApi.getById(id);
      setTransaction(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar transação');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTransaction();
    }
  }, [id]);

  return {
    transaction,
    loading,
    error,
    refetch: fetchTransaction,
  };
}
