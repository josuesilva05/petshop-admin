# PetShop Manager

Sistema de gerenciamento completo para pet shops, desenvolvido com React, TypeScript, TailwindCSS e shadcn/ui.

## 🚀 Funcionalidades

### Dashboard
- Métricas principais em tempo real
- Resumo de animais disponíveis
- Total de clientes cadastrados
- Transações e receita do mês
- Histórico de transações recentes
- Botões de ação rápida

### Gestão de Animais
- ✅ Listagem completa com busca e filtros
- ✅ Cadastro e edição de animais
- ✅ Campos: nome, espécie, raça, data de nascimento, sexo, cor, código de registro, status, valor de venda
- ✅ Observações de saúde e descrição
- ✅ Status dinâmico (Disponível, Adotado, Em Tratamento, Vendido)

### Gestão de Clientes
- ✅ Listagem com busca por nome, CPF, telefone ou email
- ✅ Cadastro e edição de clientes
- ✅ Campos: nome completo, CPF, RG, telefone, email, endereço
- ✅ Validação de CPF e formatação automática

### Gestão de Espécies e Raças
- ✅ Interface com abas para espécies e raças
- ✅ CRUD completo para espécies
- ✅ CRUD completo para raças (vinculadas a espécies)
- ✅ Relacionamento dinâmico entre espécies e raças

### Gestão de Transações
- ✅ Registro de vendas e doações
- ✅ Seleção inteligente de animais disponíveis
- ✅ Busca avançada para animais e clientes
- ✅ Atualização automática do status do animal
- ✅ Relatórios e métricas de transações
- ✅ Filtros por tipo de transação

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **Date-fns** - Manipulação de datas

## 🚀 Como Executar

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd petshop
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure a API**
   - Certifique-se de que a API backend está rodando em `http://localhost:8000`
   - Verifique se os endpoints seguem o padrão definido no schema

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse a aplicação**
   - Frontend: http://localhost:5173
   - API: http://localhost:8000

## 📋 Endpoints da API

O sistema espera os seguintes endpoints:

- `GET|POST /api/especies/` - Gestão de espécies
- `GET|POST /api/racas/` - Gestão de raças  
- `GET|POST /api/animais/` - Gestão de animais
- `GET|POST /api/clientes/` - Gestão de clientes
- `GET|POST /api/transacoes/` - Gestão de transações

## ✨ Funcionalidades Implementadas

### Formulários Inteligentes
- Validação em tempo real com Zod
- Formatação automática de dados (CPF, telefone)
- Campos dependentes (raça baseada na espécie)
- Máscaras de entrada para valores monetários

### Interface Responsiva
- Design mobile-first
- Sidebar colapsível
- Tabelas responsivas
- Componentes adaptativos

### Experiência do Usuário
- Notificações toast para feedback
- Loading states
- Busca em tempo real com debounce
- Confirmações para ações destrutivas

## 📄 Licença

Este projeto está sob a licença MIT.
