import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calculator, Plus, Minus } from 'lucide-react'

interface Ingrediente {
  id: string
  nome: string
  quantidade: number
  unidade: string
  precoUnitario: number
}

export default function CalculadoraPage() {
  // TODO: [REMOVIDO] Integração com banco de dados estava aqui
  // Implementar: localStorage para salvar receitas
  
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([
    {
      id: '1',
      nome: 'Açúcar',
      quantidade: 500,
      unidade: 'g',
      precoUnitario: 0.006
    }
  ])

  const [margem, setMargem] = useState(30)
  const [custoFixo, setCustoFixo] = useState(5.00)

  const adicionarIngrediente = () => {
    const novoIngrediente: Ingrediente = {
      id: Date.now().toString(),
      nome: '',
      quantidade: 0,
      unidade: 'g',
      precoUnitario: 0
    }
    setIngredientes([...ingredientes, novoIngrediente])
  }

  const removerIngrediente = (id: string) => {
    setIngredientes(ingredientes.filter(ing => ing.id !== id))
  }

  const atualizarIngrediente = (id: string, campo: keyof Ingrediente, valor: any) => {
    setIngredientes(ingredientes.map(ing => 
      ing.id === id ? { ...ing, [campo]: valor } : ing
    ))
  }

  const calcularCustoIngredientes = () => {
    return ingredientes.reduce((total, ing) => {
      return total + (ing.quantidade * ing.precoUnitario)
    }, 0)
  }

  const calcularPrecoFinal = () => {
    const custoIngredientes = calcularCustoIngredientes()
    const custoTotal = custoIngredientes + custoFixo
    return custoTotal * (1 + margem / 100)
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Calculadora de Preços
            </h1>
            <p className="text-gray-600">
              Calcule o preço correto dos seus doces
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredientes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Ingredientes</h2>
              <button
                onClick={adicionarIngrediente}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar</span>
              </button>
            </div>

            <div className="space-y-4">
              {ingredientes.map((ingrediente, index) => (
                <div key={ingrediente.id} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      Ingrediente #{index + 1}
                    </span>
                    {ingredientes.length > 1 && (
                      <button
                        onClick={() => removerIngrediente(ingrediente.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={ingrediente.nome}
                        onChange={(e) => atualizarIngrediente(ingrediente.id, 'nome', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Açúcar"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        value={ingrediente.quantidade}
                        onChange={(e) => atualizarIngrediente(ingrediente.id, 'quantidade', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unidade
                      </label>
                      <select
                        value={ingrediente.unidade}
                        onChange={(e) => atualizarIngrediente(ingrediente.id, 'unidade', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="g">gramas (g)</option>
                        <option value="kg">quilos (kg)</option>
                        <option value="ml">mililitros (ml)</option>
                        <option value="l">litros (l)</option>
                        <option value="unidade">unidade</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço por unidade (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={ingrediente.precoUnitario}
                        onChange={(e) => atualizarIngrediente(ingrediente.id, 'precoUnitario', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.006"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cálculo */}
          <div className="space-y-6">
            {/* Configurações */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Margem de Lucro (%)
                  </label>
                  <input
                    type="number"
                    value={margem}
                    onChange={(e) => setMargem(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custo Fixo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={custoFixo}
                    onChange={(e) => setCustoFixo(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Resultado */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900">Resultado</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Custo dos Ingredientes:</span>
                  <span className="font-medium">R$ {calcularCustoIngredientes().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Custo Fixo:</span>
                  <span className="font-medium">R$ {custoFixo.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margem ({margem}%):</span>
                  <span className="font-medium">R$ {((calcularCustoIngredientes() + custoFixo) * (margem / 100)).toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Preço Final:</span>
                  <span className="text-green-600">R$ {calcularPrecoFinal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}