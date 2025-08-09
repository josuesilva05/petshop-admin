import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from '@/pages/DashboardPage';
import { AnimalsListPage } from '@/pages/AnimalsListPage';
import { ClientsListPage } from '@/pages/ClientsListPage';
import { SpeciesManagementPage } from '@/pages/SpeciesManagementPage';
import { TransactionsListPage } from '@/pages/TransactionsListPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/animais" element={<AnimalsListPage />} />
      <Route path="/clientes" element={<ClientsListPage />} />
      <Route path="/especies-racas" element={<SpeciesManagementPage />} />
      <Route path="/transacoes" element={<TransactionsListPage />} />
    </Routes>
  );
}
