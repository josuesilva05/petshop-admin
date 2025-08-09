import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
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
import { clientsApi } from '../api';
import type { Cliente } from '@/lib/types';

const clientSchema = z.object({
  nome_completo: z.string().min(1, 'Nome completo é obrigatório'),
  cpf: z.string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(11, 'CPF deve ter 11 dígitos')
    .regex(/^\d+$/, 'CPF deve conter apenas números'),
  rg: z.string().optional(),
  telefone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .regex(/^\d+$/, 'Telefone deve conter apenas números'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  endereco: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  client?: Cliente | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nome_completo: client?.nome_completo || '',
      cpf: client?.cpf || '',
      rg: client?.rg || '',
      telefone: client?.telefone || '',
      email: client?.email || '',
      endereco: client?.endereco || '',
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      const submitData = {
        nome_completo: data.nome_completo,
        cpf: data.cpf,
        rg: data.rg || undefined,
        telefone: data.telefone,
        email: data.email || undefined,
        endereco: data.endereco || undefined,
      };

      if (client) {
        await clientsApi.update(client.id_cliente, submitData);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await clientsApi.create(submitData);
        toast.success('Cliente criado com sucesso!');
      }
      onSuccess();
    } catch (error) {
      toast.error('Erro ao salvar cliente');
      console.error(error);
    }
  };

  const formatCPF = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 11);
  };

  const formatPhone = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 11);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome_completo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="00000000000" 
                    {...field}
                    onChange={(e) => field.onChange(formatCPF(e.target.value))}
                    maxLength={11}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RG (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="000000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="11999999999" 
                    {...field}
                    onChange={(e) => field.onChange(formatPhone(e.target.value))}
                    maxLength={11}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Opcional)</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="cliente@email.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço (Opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Rua, número, bairro, cidade, CEP..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
