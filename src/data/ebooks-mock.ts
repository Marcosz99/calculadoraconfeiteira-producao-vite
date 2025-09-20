// Base de dados mock para e-books

import { EBook, EBookCategory } from '../types/ebooks'

export const categories: EBookCategory[] = [
  {
    id: 'precificacao',
    nome: 'Precificação',
    descricao: 'Aprenda a calcular preços justos e lucrativos',
    icone: '💰',
    totalEbooks: 8
  },
  {
    id: 'tecnicas',
    nome: 'Técnicas',
    descricao: 'Domine as técnicas profissionais de confeitaria',
    icone: '👩‍🍳',
    totalEbooks: 12
  },
  {
    id: 'marketing',
    nome: 'Marketing',
    descricao: 'Estratégias para promover seu negócio',
    icone: '📱',
    totalEbooks: 6
  },
  {
    id: 'gestao',
    nome: 'Gestão',
    descricao: 'Administre sua confeitaria como um profissional',
    icone: '📊',
    totalEbooks: 5
  },
  {
    id: 'receitas',
    nome: 'Receitas',
    descricao: 'Receitas exclusivas e testadas',
    icone: '📝',
    totalEbooks: 15
  }
]

export const ebooks: EBook[] = [
  {
    id: 'ebook-1',
    titulo: 'Precificação Inteligente para Confeiteiros',
    autor: 'Ana Paula Santos',
    categoria: 'precificacao',
    descricao: 'O guia definitivo para calcular preços que garantem lucro sem perder clientes',
    resumo: 'Aprenda a metodologia step-by-step para precificar qualquer doce, considerando todos os custos e margens de lucro adequadas.',
    preco: 47.90,
    precoCreditos: 12,
    imagemCapa: '/placeholder-ebook-1.jpg',
    avaliacoes: 4.8,
    numeroAvaliacoes: 234,
    tags: ['precificação', 'custos', 'margem', 'lucro'],
    nivel: 'iniciante',
    paginas: 85,
    idioma: 'Português',
    dataLancamento: new Date('2025-01-15'),
    bestseller: true,
    promocao: {
      desconto: 20,
      precoOriginal: 59.90,
      dataFim: new Date('2025-10-01')
    },
    preview: {
      capitulos: ['Introdução à Precificação', 'Calculando Custos Fixos'],
      paginasGratuitas: 12
    }
  },
  {
    id: 'ebook-2',
    titulo: 'Técnicas Avançadas de Chocolate',
    autor: 'Chef Ricardo Almeida',
    categoria: 'tecnicas',
    descricao: 'Domine a arte do chocolate com técnicas profissionais de temperagem e modelagem',
    resumo: 'Do básico ao avançado: temperagem perfeita, modelagem, recheios gourmet e decorações impressionantes.',
    preco: 89.90,
    precoCreditos: 22,
    imagemCapa: '/placeholder-ebook-2.jpg',
    avaliacoes: 4.9,
    numeroAvaliacoes: 156,
    tags: ['chocolate', 'temperagem', 'modelagem', 'gourmet'],
    nivel: 'avancado',
    paginas: 124,
    idioma: 'Português',
    dataLancamento: new Date('2025-02-20'),
    bestseller: true,
    preview: {
      capitulos: ['Fundamentos do Chocolate', 'Temperagem Clássica'],
      paginasGratuitas: 18
    }
  },
  {
    id: 'ebook-3',
    titulo: 'Marketing Digital para Confeiteiros',
    autor: 'Juliana Costa',
    categoria: 'marketing',
    descricao: 'Transforme suas redes sociais em uma máquina de vendas',
    resumo: 'Estratégias práticas para Instagram, Facebook e WhatsApp Business. Inclui templates prontos.',
    preco: 39.90,
    precoCreditos: 10,
    imagemCapa: '/placeholder-ebook-3.jpg',
    avaliacoes: 4.7,
    numeroAvaliacoes: 189,
    tags: ['marketing', 'redes sociais', 'vendas', 'instagram'],
    nivel: 'iniciante',
    paginas: 67,
    idioma: 'Português',
    dataLancamento: new Date('2025-03-10'),
    bestseller: false,
    preview: {
      capitulos: ['Instagram para Confeiteiros', 'Criando Conteúdo que Vende'],
      paginasGratuitas: 10
    }
  },
  {
    id: 'ebook-4',
    titulo: 'Gestão Financeira da Confeitaria',
    autor: 'Carlos Mendes',
    categoria: 'gestao',
    descricao: 'Organize suas finanças e maximize seus lucros',
    resumo: 'Fluxo de caixa, controle de estoque, análise de rentabilidade e planejamento financeiro.',
    preco: 55.90,
    precoCreditos: 14,
    imagemCapa: '/placeholder-ebook-4.jpg',
    avaliacoes: 4.6,
    numeroAvaliacoes: 98,
    tags: ['gestão', 'finanças', 'lucro', 'estoque'],
    nivel: 'intermediario',
    paginas: 92,
    idioma: 'Português',
    dataLancamento: new Date('2025-01-25'),
    bestseller: false,
    preview: {
      capitulos: ['Fundamentos Financeiros', 'Controle de Fluxo de Caixa'],
      paginasGratuitas: 15
    }
  },
  {
    id: 'ebook-5',
    titulo: '50 Receitas de Brigadeiros Gourmet',
    autor: 'Marina Silva',
    categoria: 'receitas',
    descricao: 'As melhores receitas de brigadeiros que conquistam qualquer paladar',
    resumo: 'Desde os clássicos até combinações inovadoras. Todas as receitas testadas e aprovadas.',
    preco: 29.90,
    precoCreditos: 8,
    imagemCapa: '/placeholder-ebook-5.jpg',
    avaliacoes: 4.8,
    numeroAvaliacoes: 312,
    tags: ['receitas', 'brigadeiro', 'gourmet', 'doces'],
    nivel: 'iniciante',
    paginas: 58,
    idioma: 'Português',
    dataLancamento: new Date('2025-02-14'),
    bestseller: true,
    preview: {
      capitulos: ['Brigadeiro Clássico', 'Brigadeiros Especiais'],
      paginasGratuitas: 8
    }
  },
  {
    id: 'ebook-6',
    titulo: 'Bolos Artísticos: Do Básico ao Profissional',
    autor: 'Fernanda Lima',
    categoria: 'tecnicas',
    descricao: 'Aprenda a criar bolos que são verdadeiras obras de arte',
    resumo: 'Técnicas de nivelamento, cobertura lisa, flores de açúcar e decorações impressionantes.',
    preco: 67.90,
    precoCreditos: 17,
    imagemCapa: '/placeholder-ebook-6.jpg',
    avaliacoes: 4.7,
    numeroAvaliacoes: 145,
    tags: ['bolos', 'decoração', 'flores', 'artístico'],
    nivel: 'intermediario',
    paginas: 103,
    idioma: 'Português',
    dataLancamento: new Date('2025-03-05'),
    bestseller: false,
    preview: {
      capitulos: ['Preparando a Base Perfeita', 'Cobertura Lisa Profissional'],
      paginasGratuitas: 14
    }
  }
]

// Simulação de biblioteca do usuário
export const getUserLibrary = () => {
  const library = localStorage.getItem('doce_calc_user_library')
  if (library) {
    return JSON.parse(library)
  }
  return {
    userId: 'user1',
    ebooks: []
  }
}

// Simulação de carrinho
export const getCart = () => {
  const cart = localStorage.getItem('doce_calc_cart')
  if (cart) {
    return JSON.parse(cart)
  }
  return []
}

export const saveCart = (cart: any[]) => {
  localStorage.setItem('doce_calc_cart', JSON.stringify(cart))
}

// Simulação de compra
export const simulatePurchase = async (ebookIds: string[], paymentMethod: 'creditos' | 'dinheiro') => {
  // Simular delay da compra
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const library = getUserLibrary()
  const newPurchases = ebookIds.map(id => ({
    ebookId: id,
    dataCompra: new Date(),
    progresso: 0,
    favorito: false,
    notas: []
  }))
  
  library.ebooks.push(...newPurchases)
  localStorage.setItem('doce_calc_user_library', JSON.stringify(library))
  
  // Limpar carrinho
  localStorage.removeItem('doce_calc_cart')
  
  return {
    success: true,
    purchaseId: `purchase_${Date.now()}`,
    downloads: ebookIds.map(id => ({
      ebookId: id,
      downloadLink: `/downloads/${id}.pdf`
    }))
  }
}