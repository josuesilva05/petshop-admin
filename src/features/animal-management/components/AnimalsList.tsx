import { useState } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal, Search } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
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
import { useAnimals } from '../hooks';
import { animalsApi } from '../api';
import { useEspecies, useRacas } from '@/features/species-management';
import { AnimalForm } from './AnimalForm';
import { useDebounce } from '@/hooks/use-debounce';
import type { Animal } from '@/lib/types';

export function AnimalsList() {
  const { animals, loading, refetch } = useAnimals();
  const { especies } = useEspecies();
  const { racas } = useRacas();
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este animal?')) {
      return;
    }

    try {
      await animalsApi.delete(id);
      toast.success('Animal excluído com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao excluir animal');
      console.error(error);
    }
  };

  const handleEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingAnimal(null);
    refetch();
  };

  const getEspecieName = (especieId: number) => {
    const especie = especies.find(e => e.id_especie === especieId);
    return especie?.nome_especie || 'N/A';
  };

  const getRacaName = (racaId: number) => {
    const raca = racas.find(r => r.id_raca === racaId);
    return raca?.nome_raca || 'N/A';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível':
        return 'bg-green-100 text-green-800';
      case 'Adotado':
        return 'bg-blue-100 text-blue-800';
      case 'Vendido':
        return 'bg-purple-100 text-purple-800';
      case 'Em Tratamento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const filteredAnimals = animals.filter(animal =>
    animal.nome.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    animal.codigo_registro.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Carregando animais...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Animal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAnimal ? 'Editar Animal' : 'Novo Animal'}
              </DialogTitle>
              <DialogDescription>
                {editingAnimal 
                  ? 'Atualize as informações do animal selecionado.' 
                  : 'Cadastre um novo animal no sistema.'}
              </DialogDescription>
            </DialogHeader>
            <AnimalForm
              animal={editingAnimal}
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
            <TableHead>Código</TableHead>
            <TableHead>Espécie</TableHead>
            <TableHead>Raça</TableHead>
            <TableHead>Sexo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAnimals.map((animal) => (
            <TableRow key={animal.id_animal}>
              <TableCell className="font-medium">{animal.nome}</TableCell>
              <TableCell>{animal.codigo_registro}</TableCell>
              <TableCell>{getEspecieName(animal.id_especie)}</TableCell>
              <TableCell>{getRacaName(animal.id_raca)}</TableCell>
              <TableCell>{animal.sexo}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(animal.status)}`}>
                  {animal.status}
                </span>
              </TableCell>
              <TableCell>{formatCurrency(animal.valor_venda)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(animal)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(animal.id_animal)}
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

      {filteredAnimals.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'Nenhum animal encontrado com este termo' : 'Nenhum animal cadastrado'}
        </div>
      )}
    </div>
  );
}
