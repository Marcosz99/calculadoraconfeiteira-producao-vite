import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Send, 
  Trash2, 
  Bot, 
  User, 
  Loader, 
  Sparkles,
  Clock,
  TrendingUp
} from 'lucide-react'
import { useChat } from '../hooks/useChat'
import { useCredits } from '../hooks/useCredits'
import { chatCategories } from '../types/chat'
import CreditsDisplay from '../components/CreditsDisplay'
import UpgradePlanModal from '../components/UpgradePlanModal'

export default function AiAssistantPage() {
  const { messages, isLoading, sendMessage, clearChat, hasCredits } = useChat()
  const { plan, remainingCredits, upgradePlanType } = useCredits()
  const [inputValue, setInputValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focar input quando carregar
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    if (!hasCredits) {
      setShowUpgradeModal(true)
      return
    }

    const message = inputValue
    setInputValue('')
    await sendMessage(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  const handleUpgrade = (planType: typeof plan.planType) => {
    upgradePlanType(planType)
    setShowUpgradeModal(false)
  }

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Esquerda */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header da Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/dashboard" 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <button
              onClick={clearChat}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Limpar conversa"
            >
              <Trash2 className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">DoceBot Pro</h1>
              <p className="text-sm text-gray-600">Seu assistente de confeitaria</p>
            </div>
          </div>

          {/* Contador de Créditos */}
          <div className="bg-gray-50 rounded-lg p-3">
            <CreditsDisplay className="justify-center" />
          </div>
        </div>

        {/* Categorias de Perguntas */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Categorias de Ajuda
          </h3>
          
          <div className="space-y-3">
            {chatCategories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                  className="w-full p-3 text-left hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <TrendingUp className={`h-4 w-4 transition-transform ${
                      selectedCategory === category.id ? 'rotate-90' : ''
                    } ${category.color}`} />
                  </div>
                </button>
                
                {selectedCategory === category.id && (
                  <div className="px-3 pb-3">
                    <div className="space-y-2">
                      {category.questions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickQuestion(question)}
                          className="w-full text-left p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Área Principal do Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header do Chat */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Chat com DoceBot Pro</h2>
              <p className="text-sm text-gray-600">
                Pergunte qualquer coisa sobre confeitaria
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {messages.length > 0 ? `${Math.floor(messages.length / 2)} perguntas` : 'Nova conversa'}
            </div>
          </div>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Olá! Sou o DoceBot Pro 🍰
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Estou aqui para te ajudar com tudo sobre confeitaria: preços, técnicas, 
                ingredientes e marketing. O que você gostaria de saber?
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-lg">
                {[
                  'Como calcular preço de brigadeiro?',
                  'Por que massa de bolo murcha?',
                  'Como conservar chocolate?',
                  'Como fotografar doces?'
                ].map((question) => (
                  <button
                    key={question}
                    onClick={() => handleQuickQuestion(question)}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors text-sm text-left"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-br from-pink-500 to-purple-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>

                     {/* Mensagem */}
                     <div className={`rounded-lg p-4 max-w-full ${
                       message.sender === 'user'
                         ? 'bg-blue-500 text-white'
                         : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                     }`}>
                      {message.isLoading ? (
                           <div className="flex items-center space-x-2 text-gray-500">
                             <Loader className="h-4 w-4 animate-spin text-pink-500" />
                             <span className="text-sm">DoceBot está pensando...</span>
                           </div>
                      ) : (
                        <>
                          <div className="whitespace-pre-line text-sm leading-relaxed">
                            {message.content}
                          </div>
                          
                           {/* Timestamp e Confiança */}
                           <div className={`flex items-center justify-between mt-3 pt-2 border-t text-xs ${
                             message.sender === 'user' 
                               ? 'text-blue-100 border-blue-400' 
                               : 'text-gray-400 border-gray-100'
                           }`}>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(message.timestamp)}</span>
                            </div>
                            {message.confidence && (
                              <span>Precisão: {message.confidence}%</span>
                            )}
                          </div>

                           {/* Perguntas Relacionadas */}
                           {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                             <div className="mt-4 pt-3 border-t border-gray-100">
                               <p className="text-xs font-medium text-gray-600 mb-2">💡 Perguntas relacionadas:</p>
                               <div className="space-y-1">
                                 {message.relatedQuestions.slice(0, 2).map((question, index) => (
                                   <button
                                     key={index}
                                     onClick={() => handleQuickQuestion(question)}
                                     className="block w-full text-left text-xs text-gray-600 hover:text-pink-600 hover:bg-pink-50 p-2 rounded transition-colors"
                                   >
                                     • {question}
                                   </button>
                                 ))}
                               </div>
                             </div>
                           )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Área de Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          {!hasCredits ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-900">Créditos esgotados</h4>
                  <p className="text-sm text-red-700">
                    Você usou todos os seus créditos IA deste mês.
                  </p>
                </div>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Fazer Upgrade
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={hasCredits ? "Digite sua pergunta sobre confeitaria..." : "Sem créditos disponíveis"}
                disabled={!hasCredits || isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || !hasCredits || isLoading}
              className="px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Pressione Enter para enviar • {remainingCredits} consultas restantes este mês
          </div>
        </div>
      </div>

      {/* Modal de Upgrade */}
      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        currentPlan={plan.planType}
        trigger="no_credits"
      />
    </div>
  )
}