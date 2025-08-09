import { useState, useEffect } from 'react';
import { especiesApi, racasApi } from '../api';
import type { Especie, Raca } from '@/lib/types';

export function useEspecies() {
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEspecies = async () => {
    try {
      setLoading(true);
      const data = await especiesApi.getAll();
      setEspecies(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar espécies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecies();
  }, []);

  return {
    especies,
    loading,
    error,
    refetch: fetchEspecies,
  };
}

export function useRacas(especieId?: number) {
  const [racas, setRacas] = useState<Raca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRacas = async () => {
    try {
      setLoading(true);
      const data = especieId 
        ? await racasApi.getByEspecie(especieId)
        : await racasApi.getAll();
      setRacas(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar raças');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRacas();
  }, [especieId]);

  return {
    racas,
    loading,
    error,
    refetch: fetchRacas,
  };
}
