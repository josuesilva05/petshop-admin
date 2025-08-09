import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EspeciesList, RacasList } from '@/features/species-management';

export function SpeciesManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Espécies & Raças</h1>
        <p className="text-muted-foreground">
          Gerencie as espécies e raças disponíveis no sistema
        </p>
      </div>

      <Tabs defaultValue="especies" className="space-y-4">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="especies">Espécies</TabsTrigger>
          <TabsTrigger value="racas">Raças</TabsTrigger>
        </TabsList>

        <TabsContent value="especies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Espécies</CardTitle>
            </CardHeader>
            <CardContent>
              <EspeciesList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="racas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Raças</CardTitle>
            </CardHeader>
            <CardContent>
              <RacasList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
