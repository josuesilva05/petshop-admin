import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionsList } from '@/features/transaction-management';

export function TransactionsListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
        <p className="text-muted-foreground">
          Histórico de vendas e doações
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsList />
        </CardContent>
      </Card>
    </div>
  );
}
