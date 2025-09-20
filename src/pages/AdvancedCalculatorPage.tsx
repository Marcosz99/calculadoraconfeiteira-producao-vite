import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Camera, Calculator, BarChart3, Save, Lightbulb, TrendingUp } from 'lucide-react'

interface Scenario {
  id: string
  name: string
  description: string
  results: {
    profitMargin: number
    monthlyRevenue: number
    unitCost: number
    suggestedPrice: number
  }
}

export default function AdvancedCalculatorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [currentScenario, setCurrentScenario] = useState({
    name: '',
    ingredients: 10,
    laborHours: 2,
    overhead: 25,
    desiredMargin: 30,
    estimatedDemand: 50
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      analyzeImage(file)
    }
  }

  const analyzeImage = async (file: File) => {
    setAnalyzing(true)
    // Simular análise de IA por foto
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const fakeAnalysis = {
      recognizedItems: ['Brigadeiro', 'Chocolate', 'Leite Condensado'],
      estimatedComplexity: 'Médio',
      suggestedIngredients: [
        { name: 'Leite condensado', quantity: '1 lata', cost: 4.50 },
        { name: 'Chocolate em pó', quantity: '3 colheres', cost: 2.00 },
        { name: 'Manteiga', quantity: '1 colher', cost: 1.50 },
        { name: 'Chocolate granulado', quantity: '100g', cost: 3.00 }
      ],
      totalIngredientCost: 11.00,
      estimatedPreparationTime: 1.5,
      difficultyLevel: 'Iniciante',
      suggestedSellingPrice: 18.50
    }
    
    setAnalysis(fakeAnalysis)
    setAnalyzing(false)
  }

  const calculateScenario = () => {
    const baseIngredientCost = currentScenario.ingredients
    const laborCost = currentScenario.laborHours * 15 // R$ 15/hora
    const overheadCost = (baseIngredientCost + laborCost) * (currentScenario.overhead / 100)
    const totalCost = baseIngredientCost + laborCost + overheadCost
    const suggestedPrice = totalCost * (1 + currentScenario.desiredMargin / 100)
    const monthlyRevenue = suggestedPrice * currentScenario.estimatedDemand
    const profitMargin = ((suggestedPrice - totalCost) / suggestedPrice) * 100

    return {
      profitMargin,
      monthlyRevenue,
      unitCost: totalCost,
      suggestedPrice
    }
  }

  const saveScenario = () => {
    if (!currentScenario.name) {
      alert('Digite um nome para o cenário')
      return
    }

    const results = calculateScenario()
    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: currentScenario.name,
      description: `${currentScenario.estimatedDemand} unidades/mês, margem ${currentScenario.desiredMargin}%`,
      results
    }

    setScenarios([...scenarios, newScenario])
    setCurrentScenario(prev => ({ ...prev, name: '' }))
  }

  const currentResults = calculateScenario()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Calculadora Avançada</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Análise por Foto */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Camera className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-semibold">Análise por Foto (IA)</h2>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {!selectedFile ? (
                <div>
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Envie uma foto do doce para análise automática</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-700"
                  >
                    Escolher Foto
                  </label>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Arquivo: {selectedFile.name}</p>
                  {analyzing ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                      <p className="text-orange-600">Analisando imagem...</p>
                    </div>
                  ) : analysis && (
                    <div className="text-left bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Análise Concluída:</h3>
                      <p><strong>Itens reconhecidos:</strong> {analysis.recognizedItems.join(', ')}</p>
                      <p><strong>Complexidade:</strong> {analysis.estimatedComplexity}</p>
                      <p><strong>Custo estimado:</strong> R$ {analysis.totalIngredientCost.toFixed(2)}</p>
                      <p><strong>Tempo preparo:</strong> {analysis.estimatedPreparationTime}h</p>
                      <p><strong>Preço sugerido:</strong> R$ {analysis.suggestedSellingPrice.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cenários Avançados */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-semibold">Cenários de Negócio</h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do cenário"
                value={currentScenario.name}
                onChange={(e) => setCurrentScenario(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custo ingredientes (R$)
                  </label>
                  <input
                    type="number"
                    value={currentScenario.ingredients}
                    onChange={(e) => setCurrentScenario(prev => ({ ...prev, ingredients: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horas de trabalho
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={currentScenario.laborHours}
                    onChange={(e) => setCurrentScenario(prev => ({ ...prev, laborHours: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overhead (%)
                  </label>
                  <input
                    type="number"
                    value={currentScenario.overhead}
                    onChange={(e) => setCurrentScenario(prev => ({ ...prev, overhead: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Margem desejada (%)
                  </label>
                  <input
                    type="number"
                    value={currentScenario.desiredMargin}
                    onChange={(e) => setCurrentScenario(prev => ({ ...prev, desiredMargin: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Demanda estimada (unidades/mês)
                  </label>
                  <input
                    type="number"
                    value={currentScenario.estimatedDemand}
                    onChange={(e) => setCurrentScenario(prev => ({ ...prev, estimatedDemand: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Resultados em tempo real */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Resultado do Cenário:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Custo unitário:</span>
                    <span className="font-semibold ml-2">R$ {currentResults.unitCost.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Preço sugerido:</span>
                    <span className="font-semibold ml-2">R$ {currentResults.suggestedPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Margem de lucro:</span>
                    <span className="font-semibold ml-2">{currentResults.profitMargin.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Receita mensal:</span>
                    <span className="font-semibold ml-2">R$ {currentResults.monthlyRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={saveScenario}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Cenário
              </button>
            </div>
          </div>
        </div>

        {/* Cenários Salvos */}
        {scenarios.length > 0 && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-semibold">Cenários Comparativos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map(scenario => (
                <div key={scenario.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{scenario.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Preço:</span>
                      <span className="font-semibold">R$ {scenario.results.suggestedPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margem:</span>
                      <span className="font-semibold">{scenario.results.profitMargin.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Receita/mês:</span>
                      <span className="font-semibold">R$ {scenario.results.monthlyRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dicas da IA */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-3">
            <Lightbulb className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-900">Dicas Inteligentes</h3>
          </div>
          <div className="space-y-2 text-blue-800">
            <p>• Considere aumentar a margem de lucro em produtos sazonais</p>
            <p>• Analise a concorrência antes de definir o preço final</p>
            <p>• Monitore seus custos mensalmente para manter a rentabilidade</p>
            <p>• Teste diferentes cenários para encontrar o ponto ótimo de vendas</p>
          </div>
        </div>
      </div>
    </div>
  )
}