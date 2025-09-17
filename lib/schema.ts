// TODO: [REMOVIDO] Schema PostgreSQL com Drizzle ORM estava aqui
// Implementar: Usar localStorage + Firebase/Supabase quando voltar para produção
// Schema removido: profiles, ingredientes, receitas, receita_ingredientes
// Dependências removidas: drizzle-orm, postgres

// Types simplificados para uso com localStorage
export type Profile = {
  id: string
  email: string
  nome: string
  plano: string
  taxa_horaria: string
  margem_lucro: string
  created_at: Date
  updated_at: Date
}

export type Ingrediente = {
  id: string
  user_id: string
  nome: string
  categoria: string
  preco: number
  unidade: string
  observacoes?: string
  created_at: Date
  updated_at: Date
}

export type Receita = {
  id: string
  user_id: string
  nome: string
  descricao?: string
  rendimento: number
  tempo_preparo: number
  complexidade: number
  categoria: string
  created_at: Date
  updated_at: Date
}

// Dados mock para desenvolvimento
export const mockIngredientes: Ingrediente[] = [
  {
    id: '1',
    user_id: 'demo',
    nome: 'Açúcar cristal',
    categoria: 'açúcares',
    preco: 0.006,
    unidade: 'g',
    observacoes: 'Açúcar comum para doces',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    user_id: 'demo',
    nome: 'Ovos',
    categoria: 'proteínas',
    preco: 0.80,
    unidade: 'unidade',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '3',
    user_id: 'demo',
    nome: 'Farinha de trigo',
    categoria: 'farinhas',
    preco: 0.004,
    unidade: 'g',
    created_at: new Date(),
    updated_at: new Date(),
  },
]