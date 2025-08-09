export interface Especie {
  id_especie: number;
  nome_especie: string;
  created_at: string;
  updated_at: string;
}

export interface Raca {
  id_raca: number;
  nome_raca: string;
  id_especie: number;
  created_at: string;
  updated_at: string;
  especie?: Especie;
}

export interface Animal {
  id_animal: number;
  nome: string;
  id_especie: number;
  id_raca: number;
  data_nascimento: string;
  sexo: 'M' | 'F';
  cor_pelagem: string;
  codigo_registro: string;
  data_chegada: string;
  status: 'Disponível' | 'Adotado' | 'Em Tratamento' | 'Vendido';
  valor_venda: number;
  observacoes_saude?: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
  especie?: Especie;
  raca?: Raca;
}

export interface Cliente {
  id_cliente: number;
  nome_completo: string;
  cpf: string;
  rg?: string;
  telefone: string;
  email?: string;
  endereco?: string;
  created_at: string;
  updated_at: string;
}

export interface Transacao {
  id_transacao: number;
  id_animal: number;
  id_cliente: number;
  tipo_transacao: 'Venda' | 'Doação';
  data_transacao: string;
  valor_final: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  animal?: Animal;
  cliente?: Cliente;
}

export interface CreateAnimalData {
  nome: string;
  id_especie: number;
  id_raca: number;
  data_nascimento: string;
  sexo: 'M' | 'F';
  cor_pelagem: string;
  codigo_registro: string;
  data_chegada: string;
  status: 'Disponível' | 'Adotado' | 'Em Tratamento' | 'Vendido';
  valor_venda: number;
  observacoes_saude?: string;
  descricao?: string;
}

export interface CreateClienteData {
  nome_completo: string;
  cpf: string;
  rg?: string;
  telefone: string;
  email?: string;
  endereco?: string;
}

export interface CreateTransacaoData {
  id_animal: number;
  id_cliente: number;
  tipo_transacao: 'Venda' | 'Doação';
  valor_final: number;
  observacoes?: string;
}

export interface CreateEspecieData {
  nome_especie: string;
}

export interface CreateRacaData {
  nome_raca: string;
  id_especie: number;
}
