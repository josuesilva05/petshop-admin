import { useState, useEffect } from 'react';
import { clientsApi } from '../api';
import type { Cliente } from '@/lib/types';

export function useClients() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientsApi.getAll();
      setClients(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
  };
}

export function useClient(id: number) {
  const [client, setClient] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const data = await clientsApi.getById(id);
      setClient(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar cliente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id]);

  return {
    client,
    loading,
    error,
    refetch: fetchClient,
  };
}
