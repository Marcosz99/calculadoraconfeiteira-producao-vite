import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight, Crown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'

export const UpgradeSuccessPage = () => {
  const { user, upgradeUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (sessionId && user) {
      verifyPayment(sessionId)
    } else {
      setVerifying(false)
    }
  }, [searchParams, user])

  const verifyPayment = async (sessionId: string) => {
    try {
      console.log('Verifying payment for session:', sessionId)
      
      // Verificar o status da subscription
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: {
          userEmail: user?.email
        }
      })
      
      if (error) {
        console.error('Error verifying payment:', error)
        setVerifying(false)
        return
      }
      
      console.log('Payment verification result:', data)
      
      if (data.subscribed) {
        // Atualizar o plano do usuário localmente
        if (upgradeUser) {
          upgradeUser('professional')
        }
        setVerified(true)
      }
      
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setVerifying(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verificando seu pagamento...
          </h2>
          <p className="text-gray-600">Aguarde um momento</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {verified ? 'Pagamento Confirmado!' : 'Obrigado pelo pagamento!'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {verified 
              ? 'Seu plano Professional foi ativado com sucesso. Agora você tem acesso a todas as funcionalidades premium!' 
              : 'Estamos processando seu pagamento. Em breve você receberá a confirmação.'
            }
          </p>

          {verified && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-purple-900">
                  Bem-vindo ao Plano Professional!
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Receitas ilimitadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Orçamentos ilimitados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Gestão completa de clientes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Relatórios avançados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Backup automático</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Suporte prioritário</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <span>Ir para o Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <div className="text-center">
              <Link
                to="/upgrade"
                className="text-gray-600 hover:text-gray-900 text-sm underline"
              >
                Voltar para planos
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Precisa de ajuda? 
            <a href="#" className="text-purple-600 hover:underline ml-1">
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}