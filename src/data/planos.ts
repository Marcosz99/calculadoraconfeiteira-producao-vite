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
    descricao: 'Para confeitarias em crescimento',
    popular: true,
    funcionalidades: [
      'Receitas ilimitadas',
      'Gestão completa de ingredientes',
      'Orçamentos ilimitados',
      'Controle básico de pedidos',
      'Relatórios essenciais',
      'Backup automático',
      'Suporte por email',
      'Templates profissionais'
    ]
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco_mensal: 69.90,
    limite_receitas: null,
    limite_orcamentos: null,
    descricao: 'Recursos avançados',
    funcionalidades: [
      'Tudo do Profissional',
      'App mobile completo',
      'Gestão avançada de clientes',
      'Agenda de entregas',
      'Relatórios avançados',
      'Integração WhatsApp Business',
      'Calculadora nutricional',
      'Suporte prioritário',
      'API básica'
    ]
  },
  {
    id: 'master',
    nome: 'Master',
    preco_mensal: 119.90,
    limite_receitas: null,
    limite_orcamentos: null,
    descricao: 'Solução completa',
    funcionalidades: [
      'Tudo do Premium',
      'Multi-usuários (até 5 funcionários)',
      'White label (sua marca)',
      'Integrações avançadas',
      'Consultoria mensal (1h)',
      'Relatórios personalizados',
      'API completa',
      'Setup personalizado',
      'Suporte por telefone'
    ]
  }
]