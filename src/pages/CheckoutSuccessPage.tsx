import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PixelService } from '../services/pixelService'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'

export default function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, profile } = useAuth()

  useEffect(() => {
    // Disparar evento Purchase quando o pagamento for confirmado
    const sessionId = searchParams.get('session_id')
    const amount = 19.90
    
    if (sessionId && user) {
      PixelService.trackPurchase({
        value: amount,
        currency: 'BRL',
        transaction_id: sessionId,
        customer_email: user.email || '',
        customer_name: profile?.nome || ''
      })
    }

    // Redirecionar para o dashboard após 5 segundos
    const timer = setTimeout(() => {
      navigate('/dashboard')
    }, 5000)

    return () => clearTimeout(timer)
  }, [searchParams, user, profile, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-green-200">
        <CardContent className="p-12 text-center">
          {/* Ícone de sucesso */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <CheckCircle className="h-24 w-24 text-green-500 animate-bounce" />
              <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-4xl font-black text-green-700 mb-4">
            🎉 Parabéns! Bem-vinda ao DoceCalc Professional!
          </h1>

          {/* Subtítulo */}
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Sua assinatura foi confirmada com sucesso. Agora você tem acesso a todas as funcionalidades profissionais!
          </p>

          {/* Lista de benefícios */}
          <div className="bg-green-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-green-800 mb-4">O que você desbloqueou:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700">✨ Receitas ilimitadas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700">🧮 Calculadora avançada</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700">🤖 100 créditos DoceBot IA/mês</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700">💰 Gestão financeira completa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700">📊 Relatórios avançados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700">🛒 Catálogo personalizado</span>
              </div>
            </div>
          </div>

          {/* Informações importantes */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-blue-800 mb-2">Lembre-se:</h3>
            <p className="text-blue-700 text-sm">
              🎁 <strong>7 dias grátis</strong> - Depois R$ 19,90/mês<br />
              📅 <strong>Compromisso de 12 meses</strong><br />
              💳 <strong>Próxima cobrança:</strong> {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Botão de ação */}
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3 mx-auto"
          >
            <span>COMEÇAR AGORA</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Contador de redirecionamento */}
          <p className="text-gray-500 text-sm mt-6">
            Você será redirecionada automaticamente em alguns segundos...
          </p>

          {/* Suporte */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">💬 Precisa de ajuda?</p>
            <p className="text-lg font-semibold text-primary">(11) 99999-9999</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}