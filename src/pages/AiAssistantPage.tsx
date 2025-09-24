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
  TrendingUp,
  Menu,
  X
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
  const [showSidebar, setShowSidebar] = useState(false)
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
    setShowSidebar(false) // Fechar sidebar no mobile
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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Overlay para mobile quando sidebar está aberta */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Header para mobile */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link 
              to="/dashboard" 
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <h1 className="text-lg font-bold text-gray-900">DoceBot Pro</h1>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Limpar conversa"
          >
            <Trash2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        {/* Contador de créditos no mobile */}
        <div className="mt-3">
          <CreditsDisplay className="justify-center" />
        </div>
      </div>

      <div className="flex h-screen lg:h-auto">
        {/* Sidebar - Responsiva */}
        <div className={`
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 
          fixed lg:static 
          top-0 left-0 
          w-80 h-full 
          bg-white border-r border-gray-200 
          flex flex-col 
          z-50 lg:z-auto
          transition-transform duration-300 ease-in-out
        `}>
          {/* Header da Sidebar - Apenas mobile */}
          <div className="lg:hidden p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Categorias</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Header da Sidebar - Desktop */}
          <div className="hidden lg:block p-4 border-b border-gray-200">
            <Link 
              to="/dashboard" 
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Link>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">DoceBot Pro</h1>
                <p className="text-sm text-gray-600">Seu assistente de confeitaria</p>
              </div>
            </div>

            {/* Contador de Créditos - Desktop */}
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
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header do Chat - Apenas desktop */}
          <div className="hidden lg:flex bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between w-full">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Chat com DoceBot Pro</h2>
                <p className="text-sm text-gray-600">
                  Pergunte qualquer coisa sobre confeitaria
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-500">
                  {messages.length > 0 ? `${Math.floor(messages.length / 2)} perguntas` : 'Nova conversa'}
                </div>
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Limpar conversa"
                >
                  <Trash2 className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 pb-20 lg:pb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
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
        </div>
      </div>

      {/* Área de Input - Fixa na parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 lg:relative bg-white border-t border-gray-200 p-4 z-20">
        {!hasCredits ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-900">Créditos esgotados</h4>
                <p className="text-sm text-red-700">
                  Você precisa de mais créditos para continuar usando o DoceBot.
                </p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Fazer Upgrade
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre confeitaria..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              {isLoading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal de Upgrade */}
      {showUpgradeModal && (
        <UpgradePlanModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentPlan={plan.planType}
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  )
}