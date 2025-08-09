import { apiClient } from '@/lib/api-client';
import type { Cliente, CreateClienteData } from '@/lib/types';

export const clientsApi = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await apiClient.get('/api/clientes/');
    return response.data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await apiClient.get(`/api/clientes/${id}/`);
    return response.data;
  },

  create: async (data: CreateClienteData): Promise<Cliente> => {
    const response = await apiClient.post('/api/clientes/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateClienteData>): Promise<Cliente> => {
    const response = await apiClient.put(`/api/clientes/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/clientes/${id}/`);
  },

  search: async (query: string): Promise<Cliente[]> => {
    const response = await apiClient.get(`/api/clientes/?search=${encodeURIComponent(query)}`);
    return response.data;
  },
};
