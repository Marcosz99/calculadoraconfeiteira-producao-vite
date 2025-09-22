import React, { useState, useEffect } from 'react'
import { Calendar, CreditCard, ExternalLink, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../integrations/supabase/client'
import { useToast } from '../hooks/use-toast'

interface SubscriptionStatus {
  subscribed: boolean
  product_id?: string
  subscription_end?: string
}

export const SubscriptionManager = () => {
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Verificando assinatura...
          </h3>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Minha Assinatura
        </h3>
        <button
          onClick={fetchSubscriptionStatus}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Atualizar status"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Status da Assinatura */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          {subscriptionStatus?.subscribed ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <AlertCircle className="w-6 h-6 text-yellow-500" />
          )}
          
          <div>
            <h4 className="font-medium text-gray-900">
              {subscriptionStatus?.subscribed ? 'Plano Professional Ativo' : 'Plano Gratuito'}
            </h4>
            <p className="text-sm text-gray-600">
              {subscriptionStatus?.subscribed 
                ? 'Você tem acesso a todos os recursos premium' 
                : 'Faça upgrade para desbloquear recursos avançados'
              }
            </p>
          </div>
        </div>

        {/* Informações da Assinatura */}
        {subscriptionStatus?.subscribed && subscriptionStatus?.subscription_end && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Próxima cobrança
              </span>
            </div>
            <p className="text-blue-800">
              {formatDate(subscriptionStatus.subscription_end)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {getDaysUntilRenewal(subscriptionStatus.subscription_end) > 0 
                ? `${getDaysUntilRenewal(subscriptionStatus.subscription_end)} dias restantes`
                : 'Renovação hoje'
              }
            </p>
          </div>
        )}

        {/* Valor da Assinatura */}
        {subscriptionStatus?.subscribed && (
          <div className="py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Valor mensal:</span>
              <span className="font-semibold text-gray-900">R$ 19,90</span>
            </div>
            <p className="text-xs text-gray-400 text-right mt-1">plano anual · 12x</p>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="space-y-3 pt-4">
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
              {portalLoading ? 'Abrindo...' : 'Gerenciar Assinatura'}
              {!portalLoading && <ExternalLink className="w-4 h-4" />}
            </button>
          ) : (
            <a
              href="/upgrade"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Fazer Upgrade
            </a>
          )}

          {subscriptionStatus?.subscribed && (
            <div className="text-xs text-gray-500 text-center">
              Cancele, altere o método de pagamento ou baixe faturas pelo portal acima
            </div>
          )}
        </div>
      </div>
    </div>
  )
}