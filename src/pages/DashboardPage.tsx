import { useState, useEffect } from 'react';
import { PawPrint, Users, DollarSign, Heart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { animalsApi } from '@/features/animal-management/api';
import { clientsApi } from '@/features/client-management/api';
import { transactionsApi } from '@/features/transaction-management/api';
import type { Transacao } from '@/lib/types';

interface DashboardStats {
  totalAnimals: number;
  availableAnimals: number;
  totalClients: number;
  monthlyTransactions: number;
  monthlyRevenue: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnimals: 0,
    availableAnimals: 0,
    totalClients: 0,
    monthlyTransactions: 0,
    monthlyRevenue: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar dados em paralelo
        const [animals, clients, transactions] = await Promise.all([
          animalsApi.getAll(),
          clientsApi.getAll(),
          transactionsApi.getAll(),
        ]);

        // Calcular estatísticas
        const availableAnimals = animals.filter(animal => animal.status === 'Disponível').length;
        
        // Transações do mês atual
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyTransactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.data_transacao);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        });

        const monthlyRevenue = monthlyTransactions.reduce((sum, transaction) => {
          return sum + (transaction.tipo_transacao === 'Venda' ? transaction.valor_final : 0);
        }, 0);

        setStats({
          totalAnimals: animals.length,
          availableAnimals,
          totalClients: clients.length,
          monthlyTransactions: monthlyTransactions.length,
          monthlyRevenue,
        });

        // Últimas 5 transações
        const sortedTransactions = transactions
          .sort((a, b) => new Date(b.data_transacao).getTime() - new Date(a.data_transacao).getTime())
          .slice(0, 5);
        
        setRecentTransactions(sortedTransactions);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu pet shop
        </p>
      </div>

      {/* Botões de ação rápida */}
      <div className="flex gap-2">
        <Button asChild>
          <Link to="/animais">
            <Plus className="h-4 w-4 mr-2" />
            Novo Animal
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/clientes">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/transacoes">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Link>
        </Button>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Animais
            </CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnimals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableAnimals} disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Cadastrados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transações do Mês
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita do Mês
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.monthlyRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transações recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Animal</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id_transacao}>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.tipo_transacao === 'Venda' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.tipo_transacao}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.animal?.nome || 'N/A'}</TableCell>
                  <TableCell>{transaction.cliente?.nome_completo || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(transaction.data_transacao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.tipo_transacao === 'Venda' 
                      ? formatCurrency(transaction.valor_final)
                      : 'Gratuito'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {recentTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação recente
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
