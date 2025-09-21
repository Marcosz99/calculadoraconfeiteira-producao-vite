import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Zap, Crown, TestTube, RefreshCw, Plus, Minus } from 'lucide-react'
import { useCredits } from '../hooks/useCredits'
import UpgradePlanModal from '../components/UpgradePlanModal'

export default function CreditTestPage() {
  const { plan, remainingCredits, loading, useCredit, canUseIA, upgradePlanType, refreshPlan } = useCredits()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const handleUseCredit = async () => {
    if (canUseIA()) {
      const success = await useCredit()
      if (success) {
        addTestResult(`✅ Crédito usado com sucesso. Restam: ${remainingCredits - 1}`)
      } else {
        addTestResult(`❌ Falha ao usar crédito`)
      }
    } else {
      addTestResult(`🚫 Sem créditos disponíveis - deve mostrar modal`)
      setShowUpgradeModal(true)
    }
  }

  const handleUpgrade = (newPlanType: typeof plan.planType) => {
    upgradePlanType(newPlanType)
    addTestResult(`🚀 Upgrade para ${newPlanType} realizado com sucesso`)
    setShowUpgradeModal(false)
  }

  const simulateReset = () => {
    // Simular reset mensal forçando uma nova data
    const newPlan = {
      ...plan,
      creditsUsedThisMonth: 0,
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
    localStorage.setItem('doce_calc_user_plan', JSON.stringify(newPlan))
    refreshPlan()
    addTestResult(`🔄 Reset mensal simulado - créditos restaurados`)
  }

  const clearTests = () => {
    setTestResults([])
    addTestResult(`🧹 Resultados dos testes limpos`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando sistema de créditos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </Link>
              <TestTube className="h-8 w-8 text-pink-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teste de Créditos IA</h1>
                <p className="text-sm text-gray-600">Validação do sistema FASE 1</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Atual */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Crown className="h-5 w-5 mr-2 text-blue-500" />
              Status Atual do Plano
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Tipo de Plano:</span>
                <span className="text-lg font-bold text-blue-600 capitalize">{plan.planType}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Créditos Totais:</span>
                <span className="text-lg font-bold text-green-600">{plan.creditsIA}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Créditos Usados:</span>
                <span className="text-lg font-bold text-orange-600">{plan.creditsUsedThisMonth}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Créditos Restantes:</span>
                <span className={`text-lg font-bold ${remainingCredits > 5 ? 'text-green-600' : remainingCredits > 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {plan.planType === 'premium' ? 'Ilimitado' : remainingCredits}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Próximo Reset:</span>
                <span className="text-sm text-gray-600">
                  {new Date(plan.resetDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Controles de Teste */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TestTube className="h-5 w-5 mr-2 text-pink-500" />
              Controles de Teste
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={handleUseCredit}
                disabled={!canUseIA() && plan.planType !== 'premium'}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                  canUseIA() || plan.planType === 'premium'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Zap className="h-4 w-4 mr-2" />
                Simular Uso de 1 Crédito
              </button>
              
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Crown className="h-4 w-4 mr-2" />
                Abrir Modal de Upgrade
              </button>
              
              <button
                onClick={simulateReset}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Simular Reset Mensal
              </button>
              
              <button
                onClick={clearTests}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                <Minus className="h-4 w-4 mr-2" />
                Limpar Resultados
              </button>
            </div>
          </div>

          {/* Resultados dos Testes */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-green-500" />
              Resultados dos Testes
            </h2>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">Nenhum teste executado ainda...</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Upgrade */}
      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        currentPlan={plan.planType}
        trigger="manual"
      />
    </div>
  )
}