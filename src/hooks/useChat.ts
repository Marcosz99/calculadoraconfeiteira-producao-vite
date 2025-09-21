import { useState, useEffect } from 'react'
import { ChatMessage, ChatSession } from '../types/chat'
import { useCredits } from './useCredits'
import { supabase } from '@/integrations/supabase/client'

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
      // Usar crédito ANTES de fazer a chamada
      const creditUsed = useCredit()
      if (!creditUsed) {
        throw new Error('Falha ao processar crédito')
      }

      // Chamar a API do Gemini via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('docebot-chat', {
        body: { 
          message: content.trim(),
          context: 'confeitaria'
        }
      })

      if (error) {
        console.error('Erro na chamada da API:', error)
        throw new Error('Erro ao conectar com o DoceBot Pro')
      }

      const aiResponse = data?.response || 'Desculpe, não consegui processar sua pergunta. Tente novamente.'
      const confidence = data?.confidence || null
      const relatedQuestions = data?.related_questions || []

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        confidence,
        relatedQuestions: relatedQuestions.slice(0, 3) // Máximo 3 perguntas relacionadas
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
        content: error instanceof Error && error.message.includes('crédito') 
          ? 'Seus créditos se esgotaram. Faça upgrade para continuar usando o DoceBot Pro!'
          : 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes. 🤖✨',
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