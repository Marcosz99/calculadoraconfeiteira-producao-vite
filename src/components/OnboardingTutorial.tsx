import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Calculator, Users, FileText, Package, TrendingUp } from 'lucide-react'

interface OnboardingStep {
  title: string
  description: string
  icon: React.ComponentType<any>
  actionText: string
  actionLink?: string
}

interface OnboardingTutorialProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const steps: OnboardingStep[] = [
  {
    title: "Bem-vinda ao DoceCalc! 🎉",
    description: "Vamos te guiar pelos primeiros passos para começar a usar nossa plataforma e crescer seu negócio de confeitaria.",
    icon: Calculator,
    actionText: "Vamos começar!"
  },
  {
    title: "Calculadora de Preços",
    description: "Calcule o preço ideal dos seus doces considerando ingredientes, tempo e margem de lucro. Nunca mais venda no prejuízo!",
    icon: Calculator,
    actionText: "Explorar Calculadora",
    actionLink: "/calculadora"
  },
  {
    title: "Gerencie suas Receitas",
    description: "Cadastre suas receitas com ingredientes e quantidades. A plataforma calcula automaticamente os custos e preços sugeridos.",
    icon: TrendingUp,
    actionText: "Ver Receitas",
    actionLink: "/receitas"
  },
  {
    title: "Controle de Ingredientes",
    description: "Mantenha um controle preciso dos seus ingredientes, preços e estoque. Receba alertas quando o estoque estiver baixo.",
    icon: Package,
    actionText: "Gerenciar Ingredientes",
    actionLink: "/ingredientes"
  },
  {
    title: "Clientes e Orçamentos",
    description: "Cadastre seus clientes e crie orçamentos profissionais. Acompanhe pedidos e histórico de vendas.",
    icon: Users,
    actionText: "Ver Clientes",
    actionLink: "/clientes"
  },
  {
    title: "Relatórios e Análises",
    description: "Visualize relatórios detalhados sobre suas vendas, produtos mais vendidos e performance do seu negócio.",
    icon: FileText,
    actionText: "Ver Relatórios",
    actionLink: "/financeiro"
  }
]

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ 
  isOpen, 
  onClose, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) return null

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const handleActionClick = () => {
    const step = steps[currentStep]
    if (step.actionLink) {
      window.location.href = step.actionLink
    } else {
      handleNext()
    }
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-11/12 max-w-md p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">
              {currentStep + 1} de {steps.length}
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="h-8 w-8 text-pink-600" />
          </div>
          
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
            {currentStepData.title}
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
            {currentStepData.description}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleActionClick}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {currentStepData.actionText}
          </button>

          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleSkip}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Pular tutorial
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 text-pink-600 hover:text-pink-700"
            >
              <span>{currentStep < steps.length - 1 ? 'Próximo' : 'Finalizar'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {currentStep === 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">💡 Dica Importante:</h3>
            <p className="text-sm text-blue-800">
              Este tutorial vai te ajudar a aproveitar ao máximo o DoceCalc. 
              Você pode pular a qualquer momento e acessar a ajuda no menu.
            </p>
          </div>
        )}

        {currentStep === steps.length - 1 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">🎯 Próximos Passos:</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Cadastre seus primeiros ingredientes</li>
              <li>• Crie sua primeira receita</li>
              <li>• Faça um teste com a calculadora</li>
              <li>• Explore os relatórios</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}