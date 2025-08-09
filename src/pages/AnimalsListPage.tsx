import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimalsList } from '@/features/animal-management';

export function AnimalsListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Animais</h1>
        <p className="text-muted-foreground">
          Gerencie todos os animais do pet shop
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Animais</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimalsList />
        </CardContent>
      </Card>
    </div>
  );
}
