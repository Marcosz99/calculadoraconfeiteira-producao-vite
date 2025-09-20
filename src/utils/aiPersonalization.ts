// Sistema de personalização para DoceBot Pro

import { KnowledgeItem } from '../data/knowledge-base'
import { SearchResult } from './aiSearch'

export interface UserContext {
  nome?: string
  nivel?: 'iniciante' | 'intermediario' | 'avancado'
  especialidades?: string[]
  receitas?: string[]
  preferencias?: string[]
}

// Personalizar resposta da IA baseada no contexto do usuário
export function personalizeAIResponse(
  searchResult: SearchResult,
  userQuestion: string,
  userContext: UserContext = {}
): string {
  const { nome = 'Confeiteiro(a)', nivel = 'iniciante', especialidades = [], receitas = [] } = userContext
  
  if (!searchResult.answer) {
    return generatePersonalizedFallback(nome, nivel, especialidades)
  }

  const baseResponse = searchResult.answer.resposta
  const personalizedIntro = generatePersonalizedIntro(nome, nivel, userQuestion)
  const adaptedResponse = adaptResponseToLevel(baseResponse, nivel)
  const personalizedTips = generatePersonalizedTips(searchResult.answer, receitas, especialidades)
  const confidenceNote = `\n\n💡 *Esta resposta tem ${searchResult.confidence}% de precisão baseada na sua pergunta.*`
  
  return `${personalizedIntro}\n\n${adaptedResponse}${personalizedTips}${confidenceNote}`
}

// Gerar introdução personalizada
function generatePersonalizedIntro(nome: string, nivel: string, question: string): string {
  const greetings = [
    `Olá ${nome}! Que ótima pergunta!`,
    `Oi ${nome}! Vou te ajudar com isso.`,
    `${nome}, essa é uma excelente dúvida!`,
    `Perfeito, ${nome}! Vamos esclarecer isso.`
  ]
  
  const levelComments = {
    iniciante: 'Como você está começando na confeitaria, vou explicar de forma bem didática:',
    intermediario: 'Com sua experiência, você certamente vai aproveitar essas dicas:',
    avancado: 'Para alguém do seu nível, aqui estão os detalhes técnicos:'
  }
  
  const greeting = greetings[Math.floor(Math.random() * greetings.length)]
  const levelComment = levelComments[nivel as keyof typeof levelComments] || levelComments.iniciante
  
  return `${greeting} ${levelComment}`
}

// Adaptar resposta ao nível do usuário
function adaptResponseToLevel(response: string, nivel: string): string {
  switch (nivel) {
    case 'iniciante':
      return response + '\n\n📚 *Dica para iniciantes: Pratique bastante e não tenha medo de errar. Cada erro é um aprendizado!*'
    
    case 'intermediario':
      return response + '\n\n⚡ *Dica pro: Experimente variar ingredientes e técnicas para criar sua assinatura única.*'
    
    case 'avancado':
      return response + '\n\n🎯 *Para experts: Considere os aspectos científicos como pH, temperatura e reações químicas para resultados perfeitos.*'
    
    default:
      return response
  }
}

// Gerar dicas personalizadas baseadas no perfil
function generatePersonalizedTips(
  answer: KnowledgeItem,
  userRecipes: string[],
  specialties: string[]
): string {
  const tips: string[] = []
  
  // Dicas baseadas nas especialidades do usuário
  if (specialties.length > 0) {
    const relevantSpecialty = specialties.find(s => 
      answer.tags.some(tag => tag.includes(s.toLowerCase())) ||
      answer.palavrasChave.some(keyword => keyword.includes(s.toLowerCase()))
    )
    
    if (relevantSpecialty) {
      tips.push(`\n🔥 *Conectando com sua especialidade em ${relevantSpecialty}: Esta técnica vai elevar ainda mais seus ${relevantSpecialty}!*`)
    }
  }
  
  // Dicas baseadas nas receitas do usuário
  if (userRecipes.length > 0) {
    const relatedRecipe = userRecipes.find(recipe =>
      answer.tags.some(tag => recipe.toLowerCase().includes(tag)) ||
      answer.palavrasChave.some(keyword => recipe.toLowerCase().includes(keyword))
    )
    
    if (relatedRecipe) {
      tips.push(`\n💡 *Aplicando em suas receitas: Você pode usar essa dica na sua receita de ${relatedRecipe}.*`)
    }
  }
  
  // Dicas baseadas na categoria
  const categoryTips = {
    precificacao: '\n💰 *Lembre-se: Um preço justo valoriza seu trabalho e garante a sustentabilidade do negócio.*',
    tecnicas: '\n👩‍🍳 *Prática leva à perfeição: Anote suas observações para aprimorar cada vez mais.*',
    ingredientes: '\n🥄 *Qualidade dos ingredientes é investimento: Bons ingredientes fazem toda a diferença no resultado final.*',
    marketing: '\n📱 *Consistência é chave: Mantenha sua presença online ativa e autêntica.*'
  }
  
  const categoryTip = categoryTips[answer.categoria as keyof typeof categoryTips]
  if (categoryTip) {
    tips.push(categoryTip)
  }
  
  return tips.join('')
}

// Gerar resposta de fallback personalizada
function generatePersonalizedFallback(
  nome: string,
  nivel: string,
  especialidades: string[]
): string {
  const specialtyText = especialidades.length > 0 
    ? ` Vejo que você trabalha com ${especialidades.join(', ')}, que tal algumas dicas específicas?`
    : ''
  
  const levelText = {
    iniciante: 'Como você está começando, sugiro focar primeiro nos fundamentos.',
    intermediario: 'Com sua experiência, você pode explorar técnicas mais avançadas.',
    avancado: 'Para alguém do seu nível, que tal experimentar inovações na confeitaria?'
  }
  
  return `Olá ${nome}! Não encontrei uma resposta específica para sua pergunta, mas estou aqui para ajudar!${specialtyText}

${levelText[nivel as keyof typeof levelText] || levelText.iniciante}

🍰 **Que tal perguntar sobre:**
• Como calcular preços de doces
• Técnicas de preparo e decoração  
• Dicas sobre ingredientes
• Estratégias de marketing para confeitaria

Estou aqui para te ajudar a crescer na confeitaria! Qual sua próxima dúvida?`
}

// Obter contexto do usuário do localStorage (mock)
export function getUserContext(): UserContext {
  try {
    const stored = localStorage.getItem('doce_calc_user_context')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Erro ao carregar contexto do usuário:', error)
  }
  
  // Contexto padrão simulado
  return {
    nome: 'Confeiteiro(a)',
    nivel: 'iniciante',
    especialidades: ['brigadeiros', 'bolos'],
    receitas: ['Brigadeiro Gourmet', 'Bolo de Chocolate', 'Torta de Limão'],
    preferencias: ['doces cremosos', 'decoração simples']
  }
}

// Salvar contexto do usuário
export function saveUserContext(context: UserContext): void {
  try {
    localStorage.setItem('doce_calc_user_context', JSON.stringify(context))
  } catch (error) {
    console.error('Erro ao salvar contexto do usuário:', error)
  }
}

// Gerar sugestões de perguntas baseadas no perfil
export function generatePersonalizedSuggestions(userContext: UserContext): string[] {
  const { nivel, especialidades, receitas } = userContext
  
  const suggestions: string[] = []
  
  // Sugestões baseadas no nível
  const levelSuggestions = {
    iniciante: [
      'Quais equipamentos básicos preciso para começar?',
      'Como calcular meu primeiro preço?',
      'Qual a diferença entre açúcar cristal e refinado?'
    ],
    intermediario: [
      'Como fazer brigadeiro gourmet que vende bem?',
      'Qual a melhor forma de precificar bolos decorados?',
      'Como expandir minha clientela?'
    ],
    avancado: [
      'Técnicas avançadas de temperar chocolate',
      'Como otimizar custos sem perder qualidade?',
      'Estratégias de marketing digital para confeitaria'
    ]
  }
  
  suggestions.push(...(levelSuggestions[nivel as keyof typeof levelSuggestions] || levelSuggestions.iniciante))
  
  // Sugestões baseadas em especialidades
  if (especialidades?.includes('brigadeiros')) {
    suggestions.push('Como fazer brigadeiro que não gruda na mão?')
  }
  if (especialidades?.includes('bolos')) {
    suggestions.push('Por que meu bolo afunda no meio?')
  }
  
  return suggestions.slice(0, 5)
}