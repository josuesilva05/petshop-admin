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
import { useEspecies } from '../hooks';
import { especiesApi } from '../api';
import { EspecieForm } from './EspecieForm';
import type { Especie } from '@/lib/types';

export function EspeciesList() {
  const { especies, loading, refetch } = useEspecies();
  const [editingEspecie, setEditingEspecie] = useState<Especie | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta espécie?')) {
      return;
    }

    try {
      await especiesApi.delete(id);
      toast.success('Espécie excluída com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao excluir espécie');
      console.error(error);
    }
  };

  const handleEdit = (especie: Especie) => {
    setEditingEspecie(especie);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingEspecie(null);
    refetch();
  };

  if (loading) {
    return <div>Carregando espécies...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Espécies</h3>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Espécie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEspecie ? 'Editar Espécie' : 'Nova Espécie'}
              </DialogTitle>
              <DialogDescription>
                {editingEspecie 
                  ? 'Atualize as informações da espécie selecionada.' 
                  : 'Cadastre uma nova espécie de animal.'}
              </DialogDescription>
            </DialogHeader>
            <EspecieForm
              especie={editingEspecie}
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
            <TableHead>Data de Criação</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {especies.map((especie) => (
            <TableRow key={especie.id_especie}>
              <TableCell className="font-medium">{especie.nome_especie}</TableCell>
              <TableCell>
                {new Date(especie.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(especie)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(especie.id_especie)}
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

      {especies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma espécie cadastrada
        </div>
      )}
    </div>
  );
}
