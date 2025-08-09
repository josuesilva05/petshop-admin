import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { transactionsApi } from '../api';
import { animalsApi } from '@/features/animal-management/api';
import { useAnimals } from '@/features/animal-management/hooks';
import { useClients } from '@/features/client-management/hooks';

const transactionSchema = z.object({
  id_animal: z.string().min(1, 'Animal é obrigatório'),
  id_cliente: z.string().min(1, 'Cliente é obrigatório'),
  tipo_transacao: z.enum(['Venda', 'Doação'], {
    message: 'Tipo de transação é obrigatório',
  }),
  valor_final: z.string().optional(),
  observacoes: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const { animals } = useAnimals();
  const { clients } = useClients();
  const [openAnimal, setOpenAnimal] = useState(false);
  const [openClient, setOpenClient] = useState(false);
  
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      id_animal: '',
      id_cliente: '',
      tipo_transacao: undefined,
      valor_final: '',
      observacoes: '',
    },
  });

  const tipoTransacao = form.watch('tipo_transacao');
  const selectedAnimalId = form.watch('id_animal');

  // Filtrar apenas animais disponíveis
  const availableAnimals = animals.filter(animal => animal.status === 'Disponível');

  const onSubmit = async (data: TransactionFormData) => {
    try {
      const submitData = {
        id_animal: parseInt(data.id_animal),
        id_cliente: parseInt(data.id_cliente),
        tipo_transacao: data.tipo_transacao,
        valor_final: data.tipo_transacao === 'Venda' ? parseFloat(data.valor_final || '0') : 0,
        observacoes: data.observacoes || undefined,
      };

      await transactionsApi.create(submitData);
      
      // Atualizar status do animal para "Adotado" ou "Vendido"
      const newStatus = data.tipo_transacao === 'Venda' ? 'Vendido' : 'Adotado';
      await animalsApi.update(parseInt(data.id_animal), { status: newStatus });
      
      toast.success('Transação registrada com sucesso!');
      onSuccess();
    } catch (error) {
      toast.error('Erro ao registrar transação');
      console.error(error);
    }
  };

  const getSelectedAnimal = () => {
    return availableAnimals.find(animal => animal?.id_animal?.toString() === selectedAnimalId);
  };

  const getSelectedClient = () => {
    return clients.find(client => client?.id_cliente?.toString() === form.watch('id_cliente'));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Seleção de Animal */}
        <FormField
          control={form.control}
          name="id_animal"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Animal</FormLabel>
              <Popover open={openAnimal} onOpenChange={setOpenAnimal}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? `${getSelectedAnimal()?.nome} (${getSelectedAnimal()?.codigo_registro})`
                        : "Selecione um animal"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar animal..." />
                    <CommandList>
                      <CommandEmpty>Nenhum animal encontrado.</CommandEmpty>
                      <CommandGroup>
                        {availableAnimals.map((animal) => (
                          <CommandItem
                            value={`${animal.nome} ${animal.codigo_registro}`}
                            key={animal.id_animal}
                            onSelect={() => {
                              form.setValue("id_animal", animal.id_animal?.toString() || '');
                              setOpenAnimal(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                animal.id_animal?.toString() === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {animal.nome} ({animal.codigo_registro})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seleção de Cliente */}
        <FormField
          control={form.control}
          name="id_cliente"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Cliente</FormLabel>
              <Popover open={openClient} onOpenChange={setOpenClient}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? getSelectedClient()?.nome_completo
                        : "Selecione um cliente"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar cliente..." />
                    <CommandList>
                      <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                      <CommandGroup>
                        {clients.map((client) => (
                          <CommandItem
                            value={client.nome_completo}
                            key={client.id_cliente}
                            onSelect={() => {
                              form.setValue("id_cliente", client.id_cliente?.toString() || '');
                              setOpenClient(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                client.id_cliente?.toString() === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {client.nome_completo}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo de Transação */}
        <FormField
          control={form.control}
          name="tipo_transacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Transação</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Venda">Venda</SelectItem>
                  <SelectItem value="Doação">Doação</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Valor Final - apenas se for venda */}
        {tipoTransacao === 'Venda' && (
          <FormField
            control={form.control}
            name="valor_final"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Final (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Observações */}
        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (Opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informações adicionais sobre a transação..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Informações do Animal Selecionado */}
        {selectedAnimalId && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Informações do Animal:</h4>
            <div className="text-sm space-y-1">
              <p><strong>Nome:</strong> {getSelectedAnimal()?.nome}</p>
              <p><strong>Código:</strong> {getSelectedAnimal()?.codigo_registro}</p>
              <p><strong>Valor sugerido:</strong> R$ {getSelectedAnimal()?.valor_venda?.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Registrando...' : 'Registrar Transação'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
