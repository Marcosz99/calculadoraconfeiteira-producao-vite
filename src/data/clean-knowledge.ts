// Clean knowledge base - no mock data for production
export interface KnowledgeItem {
  id: string
  pergunta: string
  resposta: string
  categoria: 'pricing' | 'techniques' | 'ingredients' | 'business' | 'marketing'
  tags: string[]
  dificuldade: 'básico' | 'intermediário' | 'avançado'
  palavrasChave: string[]
}

export const knowledgeBase: KnowledgeItem[] = []

export const getFullKnowledgeBase = (): KnowledgeItem[] => {
  return knowledgeBase
}

export const getKnowledgeByCategory = (categoria: KnowledgeItem['categoria']): KnowledgeItem[] => {
  return knowledgeBase.filter(item => item.categoria === categoria)
}

export const getKnowledgeStats = () => {
  return {
    total: 0,
    byCategory: {
      pricing: 0,
      techniques: 0,
      ingredients: 0,
      business: 0,
      marketing: 0
    },
    byDifficulty: {
      básico: 0,
      intermediário: 0,
      avançado: 0
    }
  }
}