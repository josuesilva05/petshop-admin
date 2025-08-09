import { apiClient } from '@/lib/api-client';
import type { Animal, CreateAnimalData } from '@/lib/types';

export const animalsApi = {
  getAll: async (): Promise<Animal[]> => {
    const response = await apiClient.get('/api/animais/');
    return response.data;
  },

  getById: async (id: number): Promise<Animal> => {
    const response = await apiClient.get(`/api/animais/${id}/`);
    return response.data;
  },

  create: async (data: CreateAnimalData): Promise<Animal> => {
    const response = await apiClient.post('/api/animais/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateAnimalData>): Promise<Animal> => {
    const response = await apiClient.put(`/api/animais/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/animais/${id}/`);
  },

  search: async (query: string): Promise<Animal[]> => {
    const response = await apiClient.get(`/api/animais/?search=${encodeURIComponent(query)}`);
    return response.data;
  },
};
