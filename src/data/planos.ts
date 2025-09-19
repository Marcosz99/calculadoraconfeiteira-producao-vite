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
      'Calculadora básica de custos',
      '3 orçamentos por mês',
      'Biblioteca com 20 ingredientes padrão',
      'Acesso web básico'
    ]
  },
  {
    id: 'professional',
    nome: 'Profissional',
    preco_mensal: 39.90,
    limite_receitas: null,
    limite_orcamentos: null,
    descricao: 'Acesso completo a todas as funcionalidades',
    popular: true,
    funcionalidades: [
      'Receitas ilimitadas',
      'Orçamentos ilimitados',
      'Gestão completa de ingredientes',
      'Gestão completa de clientes',
      'Controle completo de pedidos',
      'Relatórios completos',
      'Backup automático',
      'Catálogo público ilimitado',
      'Comunidade completa',
      'Todas as ferramentas',
      'Suporte prioritário'
    ]
  }
]