import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, CreditCard, ExternalLink, RefreshCw, AlertCircle, CheckCircle, Crown, DollarSign, Users, FileText } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../integrations/supabase/client'
import { useToast } from '../hooks/use-toast'

interface SubscriptionStatus {
  subscribed: boolean
  product_id?: string
  subscription_end?: string
}

export default function SubscriptionDashboardPage() {
  const { user, profile, checkSubscription } = useAuth()
  const { toast } = useToast()
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    fetchSubscriptionStatus()
    
    // Verificar status a cada 30 segundos
    const interval = setInterval(fetchSubscriptionStatus, 30000)
    return () => clearInterval(interval)
  }, [user])

  const fetchSubscriptionStatus = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: {
          userEmail: user.email
        }
      })

      if (error) throw error

      setSubscriptionStatus(data)
      
      // Auto-sync com o profile se necessário
      if (data?.subscribed && profile?.plano !== 'professional') {
        checkSubscription()
      } else if (!data?.subscribed && profile?.plano !== 'free') {
        checkSubscription()
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCustomerPortal = async () => {
    if (!user) return

    setPortalLoading(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      if (error) throw error

      if (data?.url) {
        window.open(data.url, '_blank')
        toast({
          title: "Portal aberto!",
          description: "Você foi redirecionado para o portal de assinatura do Stripe.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro ao abrir portal",
        description: error.message || "Tente novamente em alguns segundos.",
        variant: "destructive",
      })
    } finally {
      setPortalLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDaysUntilRenewal = (dateString: string) => {
    const renewalDate = new Date(dateString)
    const today = new Date()
    const diffTime = renewalDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Verificando assinatura...
              </h3>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center space-x-4">
          <Link 
            to="/dashboard"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Assinatura
            </h1>
            <p className="text-gray-600">
              Controle sua assinatura e histórico de pagamentos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status da Assinatura */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Status da Assinatura
                </h3>
                <button
                  onClick={fetchSubscriptionStatus}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Atualizar status"
                >
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  {subscriptionStatus?.subscribed ? (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-yellow-500" />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {subscriptionStatus?.subscribed ? 'Plano Professional Ativo' : 'Plano Gratuito'}
                    </h4>
                    <p className="text-gray-600">
                      {subscriptionStatus?.subscribed 
                        ? 'Você tem acesso completo a todos os recursos' 
                        : 'Faça upgrade para desbloquear recursos avançados'
                      }
                    </p>
                  </div>
                </div>

                {/* Informações da Assinatura */}
                {subscriptionStatus?.subscribed && subscriptionStatus?.subscription_end && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">
                            Próxima cobrança
                          </span>
                        </div>
                        <p className="text-blue-800">
                          {formatDate(subscriptionStatus.subscription_end)}
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          {getDaysUntilRenewal(subscriptionStatus.subscription_end) > 0 
                            ? `${getDaysUntilRenewal(subscriptionStatus.subscription_end)} dias restantes`
                            : 'Renovação hoje'
                          }
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">
                            Valor mensal
                          </span>
                        </div>
                        <p className="text-blue-800 text-lg font-semibold">
                          R$ 39,90
                        </p>
                        <p className="text-sm text-blue-600">
                          Cobrança automática
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recursos Incluídos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {subscriptionStatus?.subscribed ? 'Recursos Ativos' : 'Recursos do Plano Professional'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Receitas ilimitadas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Orçamentos ilimitados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Gestão completa de clientes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Relatórios avançados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Backup automático</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Suporte prioritário</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar de Ações */}
          <div className="space-y-6">
            {/* Ações Principais */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ações
              </h3>
              
              <div className="space-y-3">
                {subscriptionStatus?.subscribed ? (
                  <button
                    onClick={openCustomerPortal}
                    disabled={portalLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {portalLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    {portalLoading ? 'Abrindo...' : 'Portal de Pagamento'}
                    {!portalLoading && <ExternalLink className="w-4 h-4" />}
                  </button>
                ) : (
                  <Link
                    to="/upgrade"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    Fazer Upgrade
                  </Link>
                )}

                {subscriptionStatus?.subscribed && (
                  <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded-lg">
                    <p className="mb-2"><strong>No portal você pode:</strong></p>
                    <ul className="text-left space-y-1">
                      <li>• Cancelar assinatura</li>
                      <li>• Alterar método de pagamento</li>
                      <li>• Baixar faturas</li>
                      <li>• Ver histórico completo</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Informações de Suporte */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Precisa de ajuda?
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Tem dúvidas sobre sua assinatura ou precisa de suporte?
                </p>
                <p>
                  <strong>Email:</strong> suporte@docecalc.com
                </p>
                <p>
                  <strong>Horário:</strong> Segunda a Sexta, 9h às 18h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}