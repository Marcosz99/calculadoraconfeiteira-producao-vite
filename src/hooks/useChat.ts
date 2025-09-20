import { useState, useEffect } from 'react'
import { ChatMessage, ChatSession } from '../types/chat'
import { findAnswer } from '../utils/aiSearch'
import { personalizeAIResponse, getUserContext } from '../utils/aiPersonalization'
import { useCredits } from './useCredits'

interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  hasCredits: boolean
}

const STORAGE_KEY = 'doce_calc_chat_session'

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { canUseIA, useCredit } = useCredits()

  // Carregar mensagens salvas
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY)
    if (savedSession) {
      try {
        const session: ChatSession = JSON.parse(savedSession)
        setMessages(session.messages)
      } catch (error) {
        console.error('Erro ao carregar chat:', error)
      }
    }
  }, [])

  // Salvar mensagens
  const saveSession = (newMessages: ChatMessage[]) => {
    const session: ChatSession = {
      id: 'current',
      messages: newMessages,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }

  // Enviar mensagem
  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return

    // Verificar créditos
    if (!canUseIA()) {
      return // O componente deve mostrar modal de upgrade
    }

    // Criar mensagem do usuário
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    // Criar mensagem de loading da IA
    const loadingMessage: ChatMessage = {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      content: '',
      timestamp: new Date(),
      isLoading: true
    }

    const newMessages = [...messages, userMessage, loadingMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Simular delay da IA (1-3 segundos)
      const delay = Math.random() * 2000 + 1000
      await new Promise(resolve => setTimeout(resolve, delay))

      // Buscar resposta na base de conhecimento
      const searchResult = findAnswer(content)
      
      // Usar crédito
      const creditUsed = useCredit()
      if (!creditUsed) {
        throw new Error('Falha ao processar crédito')
      }

      // Obter contexto do usuário para personalização
      const userContext = getUserContext()
      
      // Personalizar resposta da IA
      const aiResponse = personalizeAIResponse(searchResult, content, userContext)
      const confidence = searchResult.confidence
      const relatedQuestions = searchResult.relatedQuestions

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        confidence,
        relatedQuestions
      }

      // Atualizar mensagens removendo loading e adicionando resposta
      const finalMessages = [...messages, userMessage, aiMessage]
      setMessages(finalMessages)
      saveSession(finalMessages)

    } catch (error) {
      console.error('Erro ao processar mensagem:', error)
      
      const errorMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        content: 'Ops! Algo deu errado. Tente novamente em alguns instantes. 😅',
        timestamp: new Date()
      }

      const errorMessages = [...messages, userMessage, errorMessage]
      setMessages(errorMessages)
      saveSession(errorMessages)
    } finally {
      setIsLoading(false)
    }
  }

  // Limpar chat
  const clearChat = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    hasCredits: canUseIA()
  }
}