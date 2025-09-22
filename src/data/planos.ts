import { Plano } from '../types'

export const planos: Plano[] = [
  {
    id: 'free',
    nome: 'Gratuito',
    preco_mensal: 0,
    limite_receitas: 5,
    limite_orcamentos: 3,
    descricao: 'Ideal para começar',
    funcionalidades: [
      'Até 5 receitas cadastradas',
      'Até 15 ingredientes',
      '3 cálculos na calculadora',
      '5 usos do DoceBot IA',
      'Acesso total à comunidade'
    ]
  },
  {
    id: 'professional',
    nome: 'Profissional',
    preco_mensal: 19.90,
    preco_anual: 238.80,
    desconto_anual: '12x R$ 19,90',
    teste_gratis: '7 dias grátis',
    limite_receitas: null,
    limite_orcamentos: null,
    descricao: 'Plano anual com 100% das funcionalidades',
    popular: true,
    funcionalidades: [
      'Receitas ilimitadas',
      'Ingredientes ilimitados',
      'Calculadora ilimitada',
      '100 créditos DoceBot IA/mês',
      'Acesso total ao Marketplace',
      'Gestão financeira completa',
      'Catálogo personalizado',
      'Relatórios avançados',
      'Backup automático',
      'Comunidade completa',
      'Suporte prioritário'
    ]
  }
]