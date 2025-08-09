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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { racasApi } from '../api';
import { useEspecies } from '../hooks';
import type { Raca } from '@/lib/types';

const racaSchema = z.object({
  nome_raca: z.string().min(1, 'Nome da raça é obrigatório'),
  id_especie: z.string().min(1, 'Espécie é obrigatória'),
});

type RacaFormData = z.infer<typeof racaSchema>;

interface RacaFormProps {
  raca?: Raca | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RacaForm({ raca, onSuccess, onCancel }: RacaFormProps) {
  const { especies } = useEspecies();
  
  const form = useForm<RacaFormData>({
    resolver: zodResolver(racaSchema),
    defaultValues: {
      nome_raca: raca?.nome_raca || '',
      id_especie: raca?.id_especie?.toString() || '',
    },
  });

  const onSubmit = async (data: RacaFormData) => {
    try {
      const submitData = {
        nome_raca: data.nome_raca,
        id_especie: parseInt(data.id_especie),
      };

      if (raca) {
        await racasApi.update(raca.id_raca, submitData);
        toast.success('Raça atualizada com sucesso!');
      } else {
        await racasApi.create(submitData);
        toast.success('Raça criada com sucesso!');
      }
      onSuccess();
    } catch (error) {
      toast.error('Erro ao salvar raça');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome_raca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Raça</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Labrador, Siamês, Canário..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="id_especie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Espécie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma espécie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {especies.map((especie) => (
                    <SelectItem 
                      key={especie.id_especie} 
                      value={especie.id_especie?.toString() || ''}
                    >
                      {especie.nome_especie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
