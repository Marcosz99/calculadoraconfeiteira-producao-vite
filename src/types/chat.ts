// Tipos para o sistema de chat AI Assistant

export interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  content: string
  timestamp: Date
  isLoading?: boolean
  confidence?: number
  relatedQuestions?: string[]
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface ChatCategory {
  id: string
  name: string
  icon: string
  color: string
  questions: string[]
}

export const chatCategories: ChatCategory[] = [
  {
    id: 'precificacao',
    name: 'Precificação',
    icon: '💰',
    color: 'text-green-600',
    questions: [
      'Como calcular preço de brigadeiro?',
      'Qual margem ideal para doces?',
      'Preço por peso ou unidade?',
      'Como precificar bolo de festa?',
      'Como calcular custo de mão de obra?'
    ]
  },
  {
    id: 'tecnicas',
    name: 'Técnicas',
    icon: '👩‍🍳',
    color: 'text-blue-600',
    questions: [
      'Por que massa de bolo murcha?',
      'Como fazer chantilly perfeito?',
      'Chocolate derreteu, e agora?',
      'Bolo ressecou, como evitar?',
      'Como temperar chocolate corretamente?'
    ]
  },
  {
    id: 'ingredientes',
    name: 'Ingredientes',
    icon: '🥄',
    color: 'text-purple-600',
    questions: [
      'Posso substituir manteiga por margarina?',
      'Como conservar chocolate?',
      'Leite condensado caseiro vs industrializado?',
      'Qual açúcar usar em cada doce?',
      'Como escolher ovos para confeitaria?'
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📱',
    color: 'text-pink-600',
    questions: [
      'Como fotografar doces?',
      'Onde divulgar minha confeitaria?',
      'Como precificar para delivery?',
      'Como criar cardápio atrativo?',
      'Como fazer promoções que vendem?'
    ]
  }
]