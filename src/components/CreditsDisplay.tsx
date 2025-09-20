import React, { useState } from 'react'
import { Crown, Zap, ArrowUp } from 'lucide-react'
import { useCredits } from '../hooks/useCredits'
import UpgradePlanModal from './UpgradePlanModal'

interface CreditsDisplayProps {
  className?: string
}

export default function CreditsDisplay({ className = '' }: CreditsDisplayProps) {
  const { plan, remainingCredits, loading, upgradePlanType } = useCredits()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  // Calcular percentual de créditos usados
  const totalCredits = plan.creditsIA
  const usedCredits = plan.creditsUsedThisMonth
  const percentage = totalCredits > 0 ? (usedCredits / totalCredits) * 100 : 0
  
  // Determinar cor baseada na porcentagem restante
  const remainingPercentage = 100 - percentage
  const getBarColor = () => {
    if (remainingPercentage > 50) return 'bg-green-500'
    if (remainingPercentage > 20) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  const getTextColor = () => {
    if (remainingPercentage > 50) return 'text-green-600'
    if (remainingPercentage > 20) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Texto do plano
  const getPlanText = () => {
    switch (plan.planType) {
      case 'gratuito': return 'Gratuito'
      case 'profissional': return 'Pro'
      case 'premium': return 'Premium'
      default: return 'Gratuito'
    }
  }

  // Ícone do plano
  const getPlanIcon = () => {
    switch (plan.planType) {
      case 'premium': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'profissional': return <Crown className="h-4 w-4 text-blue-500" />
      default: return <Zap className="h-4 w-4 text-gray-500" />
    }
  }

  const showUpgradeButton = remainingCredits <= 2 && plan.planType !== 'premium'

  const handleUpgrade = (newPlanType: typeof plan.planType) => {
    upgradePlanType(newPlanType)
    setShowUpgradeModal(false)
  }

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true)
  }

  return (
    <>
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Badge do Plano */}
        <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full">
          {getPlanIcon()}
          <span className="text-xs font-medium text-gray-700">{getPlanText()}</span>
        </div>

        {/* Contador de Créditos */}
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-gray-400" />
            <span className={`text-sm font-medium ${getTextColor()}`}>
              {plan.planType === 'premium' ? 'Ilimitado' : `${remainingCredits}/${totalCredits}`}
            </span>
          </div>
          
          {/* Barra de Progresso */}
          {plan.planType !== 'premium' && (
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full transition-all duration-300 ${getBarColor()}`}
                style={{ width: `${Math.max(0, remainingPercentage)}%` }}
              />
            </div>
          )}
          
          <span className="text-xs text-gray-500 mt-0.5">
            {plan.planType === 'premium' ? 'Consultas IA' : 'consultas restantes'}
          </span>
        </div>

        {/* Botão de Upgrade */}
        {showUpgradeButton && (
          <button
            onClick={handleUpgradeClick}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-medium rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowUp className="h-3 w-3" />
            <span>Upgrade</span>
          </button>
        )}
      </div>

      {/* Modal de Upgrade */}
      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        currentPlan={plan.planType}
        trigger={remainingCredits === 0 ? 'no_credits' : 'low_credits'}
      />
    </>
  )
}