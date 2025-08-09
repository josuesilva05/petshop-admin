import { useState, useEffect } from 'react';
import { animalsApi } from '../api';
import type { Animal } from '@/lib/types';

export function useAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const data = await animalsApi.getAll();
      setAnimals(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar animais');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  return {
    animals,
    loading,
    error,
    refetch: fetchAnimals,
  };
}

export function useAnimal(id: number) {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimal = async () => {
    try {
      setLoading(true);
      const data = await animalsApi.getById(id);
      setAnimal(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar animal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAnimal();
    }
  }, [id]);

  return {
    animal,
    loading,
    error,
    refetch: fetchAnimal,
  };
}
