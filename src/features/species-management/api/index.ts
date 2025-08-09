import { apiClient } from '@/lib/api-client';
import type { Especie, Raca, CreateEspecieData, CreateRacaData } from '@/lib/types';

export const especiesApi = {
  getAll: async (): Promise<Especie[]> => {
    const response = await apiClient.get('/api/especies/');
    // Corrige o campo id -> id_especie
    return response.data.map((item: any) => ({
      ...item,
      id_especie: item.id,
    }));
  },

  create: async (data: CreateEspecieData): Promise<Especie> => {
    const response = await apiClient.post('/api/especies/', data);
    return response.data;
  },

  update: async (id: number, data: CreateEspecieData): Promise<Especie> => {
    const response = await apiClient.put(`/api/especies/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/especies/${id}/`);
  },
};

export const racasApi = {
  getAll: async (): Promise<Raca[]> => {
    const response = await apiClient.get('/api/racas/');
    // Corrige o campo id -> id_raca
    return response.data.map((item: any) => ({
      ...item,
      id_raca: item.id,
      id_especie: item.id_especie,
    }));
  },

  getByEspecie: async (especieId: number): Promise<Raca[]> => {
    const response = await apiClient.get('/api/racas/');
    // Filtra as raças pela espécie e corrige os campos
    return response.data
      .filter((item: any) => item.id_especie === especieId)
      .map((item: any) => ({
        ...item,
        id_raca: item.id,
        id_especie: item.id_especie,
      }));
  },

  create: async (data: CreateRacaData): Promise<Raca> => {
    const response = await apiClient.post('/api/racas/', data);
    return response.data;
  },

  update: async (id: number, data: CreateRacaData): Promise<Raca> => {
    const response = await apiClient.put(`/api/racas/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/racas/${id}/`);
  },
};
