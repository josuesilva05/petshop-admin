import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientsList } from '@/features/client-management';

export function ClientsListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie os clientes do pet shop
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientsList />
        </CardContent>
      </Card>
    </div>
  );
}
