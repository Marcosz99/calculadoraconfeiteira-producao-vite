// Tipos para sistema de e-books

export interface EBook {
  id: string
  titulo: string
  autor: string
  categoria: 'precificacao' | 'tecnicas' | 'marketing' | 'gestao' | 'receitas'
  descricao: string
  resumo: string
  preco: number
  precoCreditos: number
  imagemCapa: string
  avaliacoes: number
  numeroAvaliacoes: number
  tags: string[]
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  paginas: number
  idioma: string
  dataLancamento: Date
  bestseller: boolean
  promocao?: {
    desconto: number
    precoOriginal: number
    dataFim: Date
  }
  preview: {
    capitulos: string[]
    paginasGratuitas: number
  }
}

export interface EBookPurchase {
  id: string
  userId: string
  ebookId: string
  metodoPagamento: 'creditos' | 'dinheiro'
  valor: number
  dataCompra: Date
  status: 'pendente' | 'concluida' | 'falhou'
  downloadLink?: string
}

export interface EBookCategory {
  id: string
  nome: string
  descricao: string
  icone: string
  totalEbooks: number
}

export interface CartItem {
  ebookId: string
  ebook: EBook
  quantidade: number
}

export interface UserLibrary {
  userId: string
  ebooks: {
    ebookId: string
    dataCompra: Date
    progresso: number
    favorito: boolean
    notas: string[]
  }[]
}