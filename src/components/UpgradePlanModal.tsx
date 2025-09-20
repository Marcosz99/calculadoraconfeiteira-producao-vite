import React, { useState } from 'react'
import { X, Crown, Zap, Check, Sparkles, Star, Rocket } from 'lucide-react'
import { UserPlan } from '../types'

interface UpgradePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: (planType: UserPlan['planType']) => void
  currentPlan: UserPlan['planType']
  trigger?: 'no_credits' | 'manual' | 'low_credits'
}

const plans = [
  {
    id: 'gratuito' as const,
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    credits: '10 consultas',
    icon: <Zap className="h-6 w-6" />,
    color: 'gray',
    popular: false,
    features: [
      'Calculadora básica de preços',
      '10 consultas IA por mês',
      'Até 20 receitas',
      'Relatórios básicos',
      'Suporte por email',
    ],
  },
  {
    id: 'profissional' as const,
    name: 'Profissional',
    price: 'R$ 47',
    period: '/mês',
    credits: '100 consultas',
    icon: <Crown className="h-6 w-6" />,
    color: 'blue',
    popular: true,
    features: [
      'Tudo do plano Gratuito',
      '100 consultas IA por mês',
      'Receitas ilimitadas',
      'Análise de cenários avançada',
      'Catálogo personalizado',
      'Relatórios avançados',
      'Integração com marketplace',
      'Suporte prioritário',
    ],
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: 'R$ 97',
    period: '/mês',
    credits: 'Ilimitado',
    icon: <Star className="h-6 w-6" />,
    color: 'purple',
    popular: false,
    features: [
      'Tudo do plano Profissional',
      'Consultas IA ilimitadas',
      'AI Assistant personalizado',
      'Análise de fotos de ingredientes',
      'Automação de processos',
      'API para integrações',
      'Mentor exclusivo',
      'Suporte 24/7',
    ],
  },
]

export default function UpgradePlanModal({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  currentPlan,
  trigger = 'manual'
}: UpgradePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<UserPlan['planType'] | null>(null)
  const [upgrading, setUpgrading] = useState(false)

  if (!isOpen) return null

  const getTitle = () => {
    switch (trigger) {
      case 'no_credits':
        return '🚫 Ops! Créditos esgotados'
      case 'low_credits':
        return '⚠️ Poucos créditos restantes'
      default:
        return '🚀 Potencialize sua confeitaria'
    }
  }

  const getSubtitle = () => {
    switch (trigger) {
      case 'no_credits':
        return 'Você usou todos os seus créditos IA deste mês. Faça upgrade para continuar usando o DoceBot Pro!'
      case 'low_credits':
        return 'Seus créditos estão acabando. Que tal garantir mais consultas com a IA?'
      default:
        return 'Escolha o plano ideal para levar sua confeitaria ao próximo nível com recursos avançados'
    }
  }

  const handleUpgrade = async (planType: UserPlan['planType']) => {
    if (planType === currentPlan) return

    setUpgrading(true)
    setSelectedPlan(planType)

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000))

    onUpgrade(planType)
    setUpgrading(false)
    onClose()
  }

  const getPlanButtonText = (planId: UserPlan['planType']) => {
    if (planId === currentPlan) return 'Plano Atual'
    if (upgrading && selectedPlan === planId) return 'Processando...'
    if (planId === 'gratuito') return 'Manter Gratuito'
    return 'Escolher Plano'
  }

  const isPlanDisabled = (planId: UserPlan['planType']) => {
    return planId === currentPlan || upgrading
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
            <p className="text-gray-600 mt-1">{getSubtitle()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={upgrading}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan
            const isSelected = selectedPlan === plan.id
            const isPopular = plan.popular
            const isProcessing = upgrading && isSelected

            return (
              <div
                key={plan.id}
                className={`relative border-2 rounded-xl p-6 transition-all duration-200 ${
                  isCurrentPlan
                    ? 'border-green-500 bg-green-50'
                    : isPopular
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Mais Popular</span>
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Atual
                    </span>
                  </div>
                )}

                {/* Plan Icon */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                  plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  plan.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>

                {/* Plan Details */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{plan.credits} de IA</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isPlanDisabled(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isCurrentPlan
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : plan.color === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : plan.color === 'purple'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  } ${
                    isPlanDisabled(plan.id) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing && <Rocket className="h-4 w-4 mr-2 inline animate-spin" />}
                  {getPlanButtonText(plan.id)}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="text-center text-sm text-gray-600">
            <p>✨ Todos os planos incluem:</p>
            <p className="mt-1">Acesso total às receitas • Suporte técnico • Atualizações gratuitas</p>
            <p className="mt-2 text-xs">💡 Cancelamento a qualquer momento • Sem fidelidade</p>
          </div>
        </div>
      </div>
    </div>
  )
}