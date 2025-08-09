import { useState } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRacas, useEspecies } from '../hooks';
import { racasApi } from '../api';
import { RacaForm } from './RacaForm';
import type { Raca } from '@/lib/types';

export function RacasList() {
  const { racas, loading, refetch } = useRacas();
  const { especies } = useEspecies();
  const [editingRaca, setEditingRaca] = useState<Raca | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta raça?')) {
      return;
    }

    try {
      await racasApi.delete(id);
      toast.success('Raça excluída com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao excluir raça');
      console.error(error);
    }
  };

  const handleEdit = (raca: Raca) => {
    setEditingRaca(raca);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingRaca(null);
    refetch();
  };

  const getEspecieName = (especieId: number) => {
    const especie = especies.find(e => e.id_especie === especieId);
    return especie?.nome_especie || 'N/A';
  };

  if (loading) {
    return <div>Carregando raças...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Raças</h3>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Raça
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRaca ? 'Editar Raça' : 'Nova Raça'}
              </DialogTitle>
              <DialogDescription>
                {editingRaca 
                  ? 'Atualize as informações da raça selecionada.' 
                  : 'Cadastre uma nova raça para a espécie selecionada.'}
              </DialogDescription>
            </DialogHeader>
            <RacaForm
              raca={editingRaca}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Espécie</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {racas.map((raca) => (
            <TableRow key={raca.id_raca}>
              <TableCell className="font-medium">{raca.nome_raca}</TableCell>
              <TableCell>{getEspecieName(raca.id_especie)}</TableCell>
              <TableCell>
                {new Date(raca.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(raca)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(raca.id_raca)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {racas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma raça cadastrada
        </div>
      )}
    </div>
  );
}
