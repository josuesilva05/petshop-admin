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
import { useClients } from '../hooks';
import { clientsApi } from '../api';
import { ClientForm } from './ClientForm';
import { useDebounce } from '@/hooks/use-debounce';
import type { Cliente } from '@/lib/types';

export function ClientsList() {
  const { clients, loading, refetch } = useClients();
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }

    try {
      await clientsApi.delete(id);
      toast.success('Cliente excluído com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao excluir cliente');
      console.error(error);
    }
  };

  const handleEdit = (client: Cliente) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingClient(null);
    refetch();
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  const filteredClients = clients.filter(client =>
    client.nome_completo.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    client.cpf.includes(debouncedSearchTerm) ||
    client.telefone.includes(debouncedSearchTerm) ||
    (client.email && client.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
  );

  if (loading) {
    return <div>Carregando clientes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CPF, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-80"
            />
          </div>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
              <DialogDescription>
                {editingClient 
                  ? 'Atualize as informações do cliente selecionado.' 
                  : 'Cadastre um novo cliente no sistema.'}
              </DialogDescription>
            </DialogHeader>
            <ClientForm
              client={editingClient}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome Completo</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client) => (
            <TableRow key={client.id_cliente}>
              <TableCell className="font-medium">{client.nome_completo}</TableCell>
              <TableCell>{formatCPF(client.cpf)}</TableCell>
              <TableCell>{formatPhone(client.telefone)}</TableCell>
              <TableCell>{client.email || '-'}</TableCell>
              <TableCell>
                {new Date(client.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(client)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(client.id_cliente)}
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

      {filteredClients.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'Nenhum cliente encontrado com este termo' : 'Nenhum cliente cadastrado'}
        </div>
      )}
    </div>
  );
}
