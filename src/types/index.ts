// Tipos de dados centrais do DoceCalc

export interface User {
  id: string
  nome: string
  email: string
  telefone?: string
  plano: 'free' | 'professional' | 'premium' | 'master'
  data_cadastro: string
  ativo: boolean
  avatar?: string
}

export interface PerfilConfeitaria {
  id: string
  usuario_id: string
  nome_fantasia: string
  especialidades: string[]
  cidade: string
  estado: string
  instagram?: string
  whatsapp?: string
  logo?: string
}

export interface Plano {
  id: string
  nome: string
  preco_mensal: number
  limite_receitas: number | null // null = ilimitado
  limite_orcamentos: number | null
  funcionalidades: string[]
  descricao: string
  popular?: boolean
}

export interface Categoria {
  id: string
  usuario_id: string
  nome: string
  cor_hex: string
  icone: string
  ordem: number
}

export interface Receita {
  id: string
  usuario_id: string
  categoria_id: string
  nome: string
  descricao: string
  modo_preparo: string[]
  tempo_preparo_mins: number
  rendimento: string
  dificuldade: 'iniciante' | 'intermediario' | 'avancado'
  foto_principal?: string
  ingredientes: ReceitaIngrediente[]
  tags: string[]
  ativo: boolean
  criado_em: string
  custo_calculado?: number
  preco_sugerido?: number
}

export interface IngredienteSistema {
  id: string
  nome: string
  unidade_padrao: string
  categoria: string
  preco_medio_nacional: number
}

export interface IngredienteUsuario {
  id: string
  usuario_id: string
  ingrediente_sistema_id?: string
  nome: string
  preco_atual: number
  preco_anterior?: number
  fornecedor?: string
  unidade: string
  categoria: string
  data_atualizacao: string
  estoque_atual?: number
  estoque_minimo?: number
}

export interface ReceitaIngrediente {
  id: string
  receita_id: string
  ingrediente_id: string
  quantidade: number
  unidade: string
  observacoes?: string
  ordem: number
}

export interface Cliente {
  id: string
  usuario_id: string
  nome: string
  telefone?: string
  whatsapp?: string
  email?: string
  endereco_completo?: string
  data_nascimento?: string
  observacoes?: string
  criado_em: string
  ativo: boolean
  historico_pedidos: number
  valor_total_gasto: number
}

export interface Orcamento {
  id: string
  usuario_id: string
  cliente_id: string
  cliente_nome_avulso?: string
  numero_orcamento: string
  data_criacao: string
  data_validade: string
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'expirado'
  valor_total: number
  descricao?: string
  observacoes?: string
  incluir_qr_code?: boolean
  itens: OrcamentoItem[]
}

export interface OrcamentoItem {
  id: string
  orcamento_id: string
  receita_id: string
  quantidade: number
  valor_unitario: number
  valor_total: number
  observacoes?: string
}

export interface Pedido {
  id: string
  orcamento_id: string
  data_confirmacao: string
  data_entrega: string
  status: 'confirmado' | 'producao' | 'pronto' | 'entregue' | 'cancelado'
  forma_pagamento: 'dinheiro' | 'cartao' | 'pix' | 'transferencia'
  valor_pago: number
  observacoes_entrega?: string
}

export interface ConfiguracaoUsuario {
  id: string
  usuario_id: string
  moeda: string
  fuso_horario: string
  margem_padrao: number
  custo_hora_trabalho: number
  notificacoes_email: boolean
  notificacoes_whatsapp: boolean
}

export interface RelatorioVendas {
  periodo: string
  total_vendas: number
  total_lucro: number
  total_pedidos: number
  ticket_medio: number
  produtos_mais_vendidos: {
    receita_id: string
    nome: string
    quantidade: number
    valor_total: number
  }[]
  clientes_ativos: number
}

export interface CalculoPreco {
  receita_id: string
  custo_ingredientes: number
  custo_fixo: number
  custo_mao_obra: number
  margem_lucro: number
  preco_final: number
  breakdown: {
    ingrediente_id: string
    nome: string
    quantidade: number
    custo: number
  }[]
}

// Ferramentas auxiliares
export interface ConversaoMedida {
  de: string
  para: string
  fator: number
}

export interface EtiquetaProduto {
  receita_id: string
  nome_produto: string
  preco: number
  data_validade?: string
  ingredientes?: string[]
  codigo_barras?: string
}

export interface TemplateOrcamento {
  id: string
  usuario_id: string
  nome_template: string
  conteudo_html: string
  padrao: boolean
  ativo: boolean
}