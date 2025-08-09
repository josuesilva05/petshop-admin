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
import { especiesApi } from '../api';
import type { Especie } from '@/lib/types';

const especieSchema = z.object({
  nome_especie: z.string().min(1, 'Nome da espécie é obrigatório'),
});

type EspecieFormData = z.infer<typeof especieSchema>;

interface EspecieFormProps {
  especie?: Especie | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EspecieForm({ especie, onSuccess, onCancel }: EspecieFormProps) {
  const form = useForm<EspecieFormData>({
    resolver: zodResolver(especieSchema),
    defaultValues: {
      nome_especie: especie?.nome_especie || '',
    },
  });

  const onSubmit = async (data: EspecieFormData) => {
    try {
      if (especie) {
        await especiesApi.update(especie.id_especie, data);
        toast.success('Espécie atualizada com sucesso!');
      } else {
        await especiesApi.create(data);
        toast.success('Espécie criada com sucesso!');
      }
      onSuccess();
    } catch (error) {
      toast.error('Erro ao salvar espécie');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome_especie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Espécie</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Cão, Gato, Pássaro..." {...field} />
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
