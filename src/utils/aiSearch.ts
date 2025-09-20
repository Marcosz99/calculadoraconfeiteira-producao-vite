import { getFullKnowledgeBase, KnowledgeItem } from '../data/knowledge-base'

export interface SearchResult {
  answer: KnowledgeItem | null
  confidence: number
  suggestions: KnowledgeItem[]
  relatedQuestions: string[]
}

export interface SearchMatch {
  item: KnowledgeItem
  score: number
  matchedWords: string[]
}

// Função principal de busca inteligente
export function findAnswer(userQuestion: string): SearchResult {
  const knowledgeBase = getFullKnowledgeBase()
  const cleanQuestion = normalizeText(userQuestion)
  const questionWords = extractWords(cleanQuestion)
  
  // Buscar matches na base de conhecimento
  const matches = searchMatches(questionWords, knowledgeBase)
  
  // Filtrar matches com score mínimo
  const validMatches = matches.filter(match => match.score >= 2)
  
  if (validMatches.length === 0) {
    return {
      answer: null,
      confidence: 0,
      suggestions: getRandomSuggestions(knowledgeBase, 3),
      relatedQuestions: getDefaultQuestions()
    }
  }
  
  // Pegar o melhor match
  const bestMatch = validMatches[0]
  const confidence = calculateConfidence(bestMatch.score, questionWords.length)
  
  // Gerar sugestões relacionadas
  const suggestions = getSimilarQuestions(bestMatch.item, knowledgeBase, 3)
  const relatedQuestions = getRelatedQuestions(bestMatch.item.categoria, knowledgeBase)
  
  return {
    answer: bestMatch.item,
    confidence,
    suggestions,
    relatedQuestions
  }
}

// Normalizar texto removendo acentos e caracteres especiais
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, ' ') // Remove pontuação
    .replace(/\s+/g, ' ') // Múltiplos espaços em um
    .trim()
}

// Extrair palavras relevantes (remove stop words)
function extractWords(text: string): string[] {
  const stopWords = [
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
    'para', 'por', 'com', 'sem', 'ate', 'sobre', 'entre',
    'e', 'ou', 'mas', 'pois', 'que', 'se', 'como',
    'eu', 'tu', 'ele', 'ela', 'nos', 'vos', 'eles', 'elas',
    'meu', 'minha', 'meus', 'minhas', 'seu', 'sua', 'seus', 'suas',
    'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas',
    'aquele', 'aquela', 'aqueles', 'aquelas', 'isso', 'isto', 'aquilo',
    'ser', 'estar', 'ter', 'haver', 'fazer', 'poder', 'querer',
    'muito', 'mais', 'menos', 'bem', 'mal', 'melhor', 'pior'
  ]
  
  return text
    .split(' ')
    .filter(word => word.length > 2 && !stopWords.includes(word))
}

// Buscar matches na base de conhecimento
function searchMatches(questionWords: string[], knowledgeBase: KnowledgeItem[]): SearchMatch[] {
  const matches: SearchMatch[] = []
  
  for (const item of knowledgeBase) {
    const score = calculateMatchScore(questionWords, item)
    const matchedWords = getMatchedWords(questionWords, item)
    
    if (score > 0) {
      matches.push({
        item,
        score,
        matchedWords
      })
    }
  }
  
  // Ordenar por score (maior para menor)
  return matches.sort((a, b) => b.score - a.score)
}

// Calcular score de match
function calculateMatchScore(questionWords: string[], item: KnowledgeItem): number {
  let score = 0
  
  // Combinar todos os textos do item para busca
  const searchTexts = [
    normalizeText(item.pergunta),
    normalizeText(item.resposta),
    ...item.tags.map(normalizeText),
    ...item.palavrasChave.map(normalizeText)
  ].join(' ')
  
  // Contar matches diretos
  for (const word of questionWords) {
    if (searchTexts.includes(word)) {
      score += 1
    }
  }
  
  // Bonus para matches no título da pergunta
  const normalizedQuestion = normalizeText(item.pergunta)
  for (const word of questionWords) {
    if (normalizedQuestion.includes(word)) {
      score += 2
    }
  }
  
  // Bonus para matches em tags
  for (const tag of item.tags) {
    for (const word of questionWords) {
      if (normalizeText(tag).includes(word)) {
        score += 1.5
      }
    }
  }
  
  return score
}

// Obter palavras que fizeram match
function getMatchedWords(questionWords: string[], item: KnowledgeItem): string[] {
  const matched: string[] = []
  const searchTexts = [
    normalizeText(item.pergunta),
    ...item.tags.map(normalizeText),
    ...item.palavrasChave.map(normalizeText)
  ].join(' ')
  
  for (const word of questionWords) {
    if (searchTexts.includes(word)) {
      matched.push(word)
    }
  }
  
  return matched
}

// Calcular confiança baseada no score
function calculateConfidence(score: number, questionLength: number): number {
  const maxPossibleScore = questionLength * 3 // Assumindo bonus máximo
  const confidence = Math.min((score / maxPossibleScore) * 100, 95)
  return Math.round(confidence)
}

// Obter sugestões aleatórias
function getRandomSuggestions(knowledgeBase: KnowledgeItem[], count: number): KnowledgeItem[] {
  const shuffled = [...knowledgeBase].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Obter perguntas relacionadas por categoria
function getRelatedQuestions(categoria: string, knowledgeBase: KnowledgeItem[]): string[] {
  return knowledgeBase
    .filter(item => item.categoria === categoria)
    .slice(0, 5)
    .map(item => item.pergunta)
}

// Obter perguntas similares baseadas em tags
function getSimilarQuestions(referenceItem: KnowledgeItem, knowledgeBase: KnowledgeItem[], count: number): KnowledgeItem[] {
  const similar: { item: KnowledgeItem; similarity: number }[] = []
  
  for (const item of knowledgeBase) {
    if (item.id === referenceItem.id) continue
    
    // Calcular similaridade baseada em tags em comum
    const commonTags = item.tags.filter(tag => referenceItem.tags.includes(tag))
    const similarity = commonTags.length
    
    if (similarity > 0) {
      similar.push({ item, similarity })
    }
  }
  
  return similar
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, count)
    .map(s => s.item)
}

// Perguntas padrão quando não há match
function getDefaultQuestions(): string[] {
  return [
    'Como calcular preço de brigadeiro?',
    'Por que massa de bolo murcha?',
    'Como conservar chocolate?',
    'Como fotografar doces?',
    'Qual margem ideal para doces?'
  ]
}

// Função para busca por categoria
export function searchByCategory(categoria: KnowledgeItem['categoria']): KnowledgeItem[] {
  const knowledgeBase = getFullKnowledgeBase()
  return knowledgeBase.filter(item => item.categoria === categoria)
}

// Função para busca por dificuldade
export function searchByDifficulty(dificuldade: KnowledgeItem['dificuldade']): KnowledgeItem[] {
  const knowledgeBase = getFullKnowledgeBase()
  return knowledgeBase.filter(item => item.dificuldade === dificuldade)
}

// Função para obter perguntas mais populares (mock)
export function getPopularQuestions(): KnowledgeItem[] {
  const knowledgeBase = getFullKnowledgeBase()
  return knowledgeBase
    .slice(0, 10) // Primeiras 10 como "mais populares"
    .sort(() => 0.5 - Math.random()) // Misturar para simular popularidade
}

// Função para validar qualidade da resposta
export function validateSearchResult(result: SearchResult): boolean {
  if (!result.answer) return false
  if (result.confidence < 30) return false
  return true
}