import { apiClient } from '@/lib/api-client';
import type { Transacao, CreateTransacaoData } from '@/lib/types';

export const transactionsApi = {
  getAll: async (): Promise<Transacao[]> => {
    const response = await apiClient.get('/api/transacoes/');
    return response.data;
  },

  getById: async (id: number): Promise<Transacao> => {
    const response = await apiClient.get(`/api/transacoes/${id}/`);
    return response.data;
  },

  create: async (data: CreateTransacaoData): Promise<Transacao> => {
    const response = await apiClient.post('/api/transacoes/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateTransacaoData>): Promise<Transacao> => {
    const response = await apiClient.put(`/api/transacoes/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/transacoes/${id}/`);
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<Transacao[]> => {
    const response = await apiClient.get(`/api/transacoes/?start_date=${startDate}&end_date=${endDate}`);
    return response.data;
  },
};
