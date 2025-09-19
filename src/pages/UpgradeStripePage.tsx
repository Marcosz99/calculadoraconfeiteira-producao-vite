import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Shield, CheckCircle, Loader, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { planos } from '@/data/planos'
import { supabase } from '@/integrations/supabase/client'

export const UpgradeStripePage = () => {
  const { user, upgradeUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [checkingSubscription, setCheckingSubscription] = useState(false)

  const planoProfessional = planos.find(p => p.id === 'professional')!

  // Verificar subscription status ao carregar a página
  useEffect(() => {
    checkSubscriptionStatus()
  }, [])

  const checkSubscriptionStatus = async () => {
    if (!user) return
    
    setCheckingSubscription(true)
    
    try {
      console.log('Checking subscription status...')
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: {
          userEmail: user.email
        }
      })
      
      if (error) {
        console.error('Error checking subscription:', error)
        return
      }
      
      console.log('Subscription status:', data)
      
      if (data.subscribed) {
        // Usuário já tem assinatura ativa, atualizar estado e redirecionar
        if (upgradeUser) {
          upgradeUser('professional')
        }
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
      
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setCheckingSubscription(false)
    }
  }

  const handleStripeCheckout = async () => {
    if (!user) {
      alert('Você precisa estar logado para fazer upgrade')
      return
    }

    setLoading(true)
    
    try {
      console.log('Creating Stripe checkout session...')
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          userEmail: user.email,
          userName: user.nome
        }
      })
      
      if (error) {
        console.error('Error creating checkout:', error)
        alert('Erro ao criar sessão de pagamento: ' + (error.message || 'Erro desconhecido'))
        return
      }
      
      console.log('Checkout session created:', data)
      
      // Abrir Stripe Checkout em nova aba
      if (data.url) {
        window.open(data.url, '_blank')
      }
      
    } catch (error) {
      console.error('Error:', error)
      alert('Erro interno. Tente novamente em alguns segundos.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verificando sua assinatura...
          </h2>
          <p className="text-gray-600">Aguarde um momento</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center space-x-4">
          <Link 
            to="/upgrade"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pagamento com Cartão
            </h1>
            <p className="text-gray-600">
              Finalize sua assinatura do plano Professional
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Informações do Usuário */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Dados da Conta
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={user?.nome || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleStripeCheckout}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                {loading ? 'Processando...' : 'Pagar com Stripe'}
              </button>
            </div>

            <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Pagamento seguro processado pelo Stripe</span>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo da Assinatura
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plano Professional</span>
                <span className="font-medium">
                  R$ {planoProfessional.preco_mensal.toFixed(2).replace('.', ',')}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Frequência</span>
                <span>Mensal</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Mensal</span>
                  <span>R$ {planoProfessional.preco_mensal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-gray-900">
                Incluído na assinatura:
              </h3>
              {planoProfessional.funcionalidades.slice(0, 8).map((func, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">{func}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Vantagens:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Cancele a qualquer momento</li>
                <li>• Sem fidelidade ou taxas extras</li>
                <li>• Suporte prioritário</li>
                <li>• Atualizações automáticas</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Ao clicar em "Pagar com Stripe" você será redirecionado para o checkout seguro do Stripe.
          </p>
        </div>
      </div>
    </div>
  )
}