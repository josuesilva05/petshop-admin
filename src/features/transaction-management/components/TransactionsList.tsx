import { useState } from 'react';
import { Plus, Filter, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTransactions } from '../hooks';
import { TransactionForm } from './TransactionForm';

export function TransactionsList() {
  const { transactions, loading, refetch } = useTransactions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetch();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Venda':
        return 'bg-green-100 text-green-800';
      case 'Doação':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction.tipo_transacao === filterType;
  });

  const totalVendas = transactions
    .filter(t => t.tipo_transacao === 'Venda')
    .reduce((sum, t) => sum + t.valor_final, 0);

  const totalDoacoes = transactions.filter(t => t.tipo_transacao === 'Doação').length;

  if (loading) {
    return <div>Carregando transações...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Resumo das transações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800">Total em Vendas</h3>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(totalVendas)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">Total de Doações</h3>
          <p className="text-2xl font-bold text-blue-900">{totalDoacoes}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-800">Total de Transações</h3>
          <p className="text-2xl font-bold text-purple-900">{transactions.length}</p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as transações</SelectItem>
              <SelectItem value="Venda">Apenas vendas</SelectItem>
              <SelectItem value="Doação">Apenas doações</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Mais filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Registre uma nova venda ou doação de animal.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de transações */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Animal</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Observações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id_transacao}>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.tipo_transacao)}`}>
                  {transaction.tipo_transacao}
                </span>
              </TableCell>
              <TableCell className="font-medium">
                {transaction.animal?.nome || 'N/A'}
              </TableCell>
              <TableCell>
                {transaction.cliente?.nome_completo || 'N/A'}
              </TableCell>
              <TableCell>
                {new Date(transaction.data_transacao).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                {transaction.tipo_transacao === 'Venda' 
                  ? formatCurrency(transaction.valor_final)
                  : 'Gratuito'
                }
              </TableCell>
              <TableCell className="max-w-48 truncate">
                {transaction.observacoes || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {filterType !== 'all' 
            ? `Nenhuma transação do tipo "${filterType}" encontrada`
            : 'Nenhuma transação registrada'
          }
        </div>
      )}
    </div>
  );
}
