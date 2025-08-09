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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { animalsApi } from '../api';
import { useEspecies, useRacas } from '@/features/species-management';
import type { Animal } from '@/lib/types';

const animalSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  id_especie: z.string().min(1, 'Espécie é obrigatória'),
  id_raca: z.string().min(1, 'Raça é obrigatória'),
  data_nascimento: z.date({
    message: 'Data de nascimento é obrigatória',
  }),
  sexo: z.enum(['M', 'F'], {
    message: 'Sexo é obrigatório',
  }),
  cor_pelagem: z.string().min(1, 'Cor da pelagem é obrigatória'),
  codigo_registro: z.string().min(1, 'Código de registro é obrigatório'),
  data_chegada: z.date({
    message: 'Data de chegada é obrigatória',
  }),
  status: z.enum(['Disponível', 'Adotado', 'Em Tratamento', 'Vendido'], {
    message: 'Status é obrigatório',
  }),
  valor_venda: z.string().min(1, 'Valor de venda é obrigatório'),
  observacoes_saude: z.string().optional(),
  descricao: z.string().optional(),
});

type AnimalFormData = z.infer<typeof animalSchema>;

interface AnimalFormProps {
  animal?: Animal | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AnimalForm({ animal, onSuccess, onCancel }: AnimalFormProps) {
  const { especies } = useEspecies();
  const { racas, refetch: refetchRacas } = useRacas();
  
  const form = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      nome: animal?.nome || '',
      id_especie: animal?.id_especie?.toString() || '',
      id_raca: animal?.id_raca?.toString() || '',
      data_nascimento: animal ? new Date(animal.data_nascimento) : undefined,
  sexo: String(animal?.sexo) === 'Macho' ? 'M' : String(animal?.sexo) === 'Fêmea' ? 'F' : animal?.sexo || undefined,
      cor_pelagem: animal?.cor_pelagem || '',
      codigo_registro: animal?.codigo_registro || '',
      data_chegada: animal ? new Date(animal.data_chegada) : new Date(),
      status: animal?.status || 'Disponível',
      valor_venda: animal?.valor_venda?.toString() || '',
      observacoes_saude: animal?.observacoes_saude || '',
      descricao: animal?.descricao || '',
    },
  });

  const selectedEspecie = form.watch('id_especie');

  // Filtrar raças baseado na espécie selecionada
  const filteredRacas = racas.filter(raca => 
    raca && raca.id_especie && raca.id_especie.toString() === selectedEspecie
  );

  const onSubmit = async (data: AnimalFormData) => {
    try {
      const submitData = {
        nome: data.nome,
        id_especie: parseInt(data.id_especie),
        id_raca: parseInt(data.id_raca),
        data_nascimento: data.data_nascimento.toISOString().split('T')[0],
  sexo: data.sexo,
        cor_pelagem: data.cor_pelagem,
        codigo_registro: data.codigo_registro,
        data_chegada: data.data_chegada.toISOString().split('T')[0],
        status: data.status,
        valor_venda: parseFloat(data.valor_venda),
        observacoes_saude: data.observacoes_saude || undefined,
        descricao: data.descricao || undefined,
      };

      if (animal) {
        await animalsApi.update(animal.id_animal, submitData);
        toast.success('Animal atualizado com sucesso!');
      } else {
        await animalsApi.create(submitData);
        toast.success('Animal criado com sucesso!');
      }
      onSuccess();
    } catch (error) {
      toast.error('Erro ao salvar animal');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do animal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="codigo_registro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Registro</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: A001, DOG123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="id_especie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Espécie</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue('id_raca', ''); // Reset raça when espécie changes
                  if (value) {
                    refetchRacas();
                  }
                }} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma espécie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {especies.map((especie) => (
                      <SelectItem 
                        key={especie.id_especie} 
                        value={especie.id_especie.toString()}
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

          <FormField
            control={form.control}
            name="id_raca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raça</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedEspecie}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma raça" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredRacas.map((raca) => (
                      <SelectItem 
                        key={raca.id_raca} 
                        value={raca.id_raca?.toString() || ''}
                      >
                        {raca.nome_raca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="data_nascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onSelect={field.onChange}
                    placeholder="Selecione a data"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_chegada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Chegada</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onSelect={field.onChange}
                    placeholder="Selecione a data"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="sexo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">Macho</SelectItem>
                    <SelectItem value="F">Fêmea</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cor_pelagem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor da Pelagem</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Marrom, Preto, Branco" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Disponível">Disponível</SelectItem>
                    <SelectItem value="Adotado">Adotado</SelectItem>
                    <SelectItem value="Em Tratamento">Em Tratamento</SelectItem>
                    <SelectItem value="Vendido">Vendido</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="valor_venda"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor de Venda (R$)</FormLabel>
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

        <FormField
          control={form.control}
          name="observacoes_saude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações de Saúde</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Histórico médico, vacinas, medicamentos..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Características comportamentais, temperamento..." 
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
