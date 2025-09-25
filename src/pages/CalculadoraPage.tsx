import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calculator, Plus, Minus, Save, History, Download, PieChart, ArrowRight, CheckCircle, Search, Clock, DollarSign, Package } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { AppLayout } from '../components/Layout'
import { IngredienteUsuario, Receita, CalculoPreco } from '../types'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import { parseNumericInput, formatForInput } from '../utils/numberUtils'
import CurrencyInput from '../components/ui/CurrencyInput'
import { useSubscriptionLimits } from '../hooks/useSubscriptionLimits'
import { useSupabaseReceitas } from '../hooks/useSupabaseReceitas'
import { useSupabaseIngredientes } from '../hooks/useSupabaseIngredientes'
import { UpgradeModal } from '../components/UpgradeModal'

interface Ingrediente {
  id: string
  nome: string
  quantidade: number | null
  unidade: string
  precoUnitario: number | null
}

export default function CalculadoraPage() {
  const { user } = useAuth()
  const { canUseCalculadora, incrementCalculos, isProfessional, usage, limits } = useSubscriptionLimits()
  const { receitas, loading: receitasLoading } = useSupabaseReceitas()
  const { ingredientes: ingredientesDisponiveis, loading: ingredientesLoading } = useSupabaseIngredientes()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  // Estados existentes (mantendo funcionalidade)
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [nomeReceita, setNomeReceita] = useState('')
  const [receitaSelecionada, setReceitaSelecionada] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [historico, setHistorico] = useState<CalculoPreco[]>([])
  const [showHistorico, setShowHistorico] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
  
  // Novos estados para steps
  const [currentStep, setCurrentStep] = useState(1)
  const [tipoCalculo, setTipoCalculo] = useState<'nova' | 'existente'>('nova')
  const [searchIngredientes, setSearchIngredientes] = useState('')
  
  const [margem, setMargem] = useState<number | null>(30)
  const [custoFixo, setCustoFixo] = useState<number | null>(5.00)
  const [custoMaoObra, setCustoMaoObra] = useState<number | null>(null)
  const [tempoPreparoHoras, setTempoPreparoHoras] = useState<number | null>(1)
  const [custoHora, setCustoHora] = useState<number | null>(25)
  
  useEffect(() => {
    if (user) {
      const savedHistorico = getFromLocalStorage<CalculoPreco[]>('doce_historico_calculos', [])
      setHistorico(savedHistorico)
    }
  }, [user])

  // Funções existentes (mantendo funcionalidades)
  const adicionarIngredienteManual = () => {
    const novoIngrediente: Ingrediente = {
      id: Date.now().toString(),
      nome: '',
      quantidade: null,
      unidade: 'g',
      precoUnitario: null
    }
    setIngredientes([...ingredientes, novoIngrediente])
  }

  const adicionarIngredienteDaLista = (ingredienteId: string) => {
    const ingredienteRef = ingredientesDisponiveis.find(i => i.id === ingredienteId)
    if (ingredienteRef) {
      const novoIngrediente: Ingrediente = {
        id: Date.now().toString(),
        nome: ingredienteRef.nome,
        quantidade: null,
        unidade: ingredienteRef.unidade_padrao,
        precoUnitario: ingredienteRef.preco_medio
      }
      setIngredientes([...ingredientes, novoIngrediente])
    }
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
      const quantidade = ing.quantidade || 0
      const preco = ing.precoUnitario || 0
      return total + (quantidade * preco)
    }, 0)
  }

  const calcularPrecoFinal = () => {
    const custoIngredientes = calcularCustoIngredientes()
    const custoMaoObraCalculado = (tempoPreparoHoras || 0) * (custoHora || 0)
    const custoTotal = custoIngredientes + (custoFixo || 0) + custoMaoObraCalculado
    const precoComMargem = custoTotal * (1 + (margem || 0) / 100)
    return precoComMargem
  }

  const calcularReceita = () => {
    if (!canUseCalculadora()) {
      setShowUpgradeModal(true)
      return
    }

    const incrementado = incrementCalculos()
    if (!incrementado) {
      setShowUpgradeModal(true)
      return
    }

    const calculo: CalculoPreco = {
      receita_id: receitaSelecionada || Date.now().toString(),
      custo_ingredientes: calcularCustoIngredientes(),
      custo_fixo: custoFixo || 0,
      custo_mao_obra: (tempoPreparoHoras || 0) * (custoHora || 0),
      margem_lucro: margem || 0,
      preco_final: calcularPrecoFinal(),
      breakdown: ingredientes.map(ing => ({
        ingrediente_id: ing.id,
        nome: ing.nome,
        quantidade: ing.quantidade || 0,
        custo: (ing.quantidade || 0) * (ing.precoUnitario || 0)
      }))
    }

    const novoHistorico = [calculo, ...historico.slice(0, 19)]
    setHistorico(novoHistorico)
    saveToLocalStorage('doce_historico_calculos', novoHistorico)
    
    setShowBreakdown(true)
  }

  const carregarReceita = (receitaId: string) => {
    const receita = receitas.find(r => r.id === receitaId)
    if (receita) {
      setNomeReceita(receita.nome)
      setReceitaSelecionada(receitaId)
      
      // Carregar ingredientes da receita
      const ingredientesReceita = Array.isArray(receita.ingredientes) ? receita.ingredientes.map((ing: any) => {
        const ingredienteRef = ingredientesDisponiveis.find(i => i.id === ing.ingrediente_id)
        return {
          id: Date.now().toString() + Math.random(),
          nome: ingredienteRef?.nome || ing.nome || 'Ingrediente não encontrado',
          quantidade: ing.quantidade,
          unidade: ing.unidade,
          precoUnitario: ingredienteRef?.preco_medio || null
        }
      }) : []
      
      setIngredientes(ingredientesReceita)
      setCurrentStep(3) // Pular para configurações
    }
  }

  const ingredientesFiltrados = ingredientesDisponiveis.filter(ing => 
    ing.nome.toLowerCase().includes(searchIngredientes.toLowerCase())
  )

  const steps = [
    { number: 1, title: 'Receita', description: 'Escolha ou crie' },
    { number: 2, title: 'Ingredientes', description: 'Adicione e configure' },
    { number: 3, title: 'Configurações', description: 'Custos e margem' },
    { number:4, title: 'Resultado', description: 'Preço final' }
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calculadora de Preços</h1>
          <p className="text-gray-600">Calcule o preço ideal para suas receitas</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep === step.number 
                    ? 'border-pink-500 bg-pink-500 text-white' 
                    : currentStep > step.number 
                    ? 'border-pink-500 bg-pink-500 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                <div className="ml-3 text-left">
                  <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-px mx-4 ${currentStep > step.number ? 'bg-pink-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          
          {/* STEP 1: Seleção de Receita */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Escolha o tipo de cálculo</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <button
                  onClick={() => setTipoCalculo('nova')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    tipoCalculo === 'nova' 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Calculator className="h-8 w-8 text-pink-500 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nova Receita Rápida</h3>
                  <p className="text-gray-600 text-sm">Crie um cálculo do zero adicionando ingredientes manualmente</p>
                </button>
                
                <button
                  onClick={() => setTipoCalculo('existente')}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    tipoCalculo === 'existente' 
                      ? 'border-pink-500 bg-pink-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Save className="h-8 w-8 text-pink-500 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Receita Existente</h3>
                  <p className="text-gray-600 text-sm">Use uma receita já cadastrada como base para o cálculo</p>
                </button>
              </div>

              {tipoCalculo === 'nova' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da receita (opcional)
                  </label>
                  <input
                    type="text"
                    value={nomeReceita}
                    onChange={(e) => setNomeReceita(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ex: Brigadeiro Gourmet"
                  />
                </div>
              )}

              {tipoCalculo === 'existente' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione uma receita
                  </label>
                  <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <div className="text-blue-600 text-lg font-medium mb-2">🚀 Em breve</div>
                    <p className="text-blue-500 text-sm">
                      Funcionalidade sendo desenvolvida para uma melhor experiência
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Ingredientes */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Ingredientes da receita</h2>
              
              {/* Busca e adicionar ingredientes */}
              <div className="mb-6">
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchIngredientes}
                        onChange={(e) => setSearchIngredientes(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Buscar ingredientes..."
                      />
                    </div>
                  </div>
                  <button
                    onClick={adicionarIngredienteManual}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Manual
                  </button>
                </div>
                
                {/* Lista de ingredientes disponíveis */}
                {searchIngredientes && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Ingredientes disponíveis:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {ingredientesFiltrados.slice(0, 6).map((ing) => (
                        <button
                          key={ing.id}
                          onClick={() => adicionarIngredienteDaLista(ing.id)}
                          className="text-left p-2 bg-white rounded border hover:border-pink-300 transition-colors"
                        >
                          <p className="text-sm font-medium text-gray-900">{ing.nome}</p>
                          <p className="text-xs text-gray-600">{formatCurrency(ing.preco_medio || 0)}/{ing.unidade_padrao}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de ingredientes adicionados */}
              <div className="space-y-4">
                {ingredientes.map((ingrediente) => (
                  <div key={ingrediente.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input
                          type="text"
                          value={ingrediente.nome}
                          onChange={(e) => atualizarIngrediente(ingrediente.id, 'nome', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Nome do ingrediente"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                        <input
                          type="number"
                          step="0.01"
                          value={ingrediente.quantidade || ''}
                          onChange={(e) => atualizarIngrediente(ingrediente.id, 'quantidade', parseFloat(e.target.value) || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                        <select
                          value={ingrediente.unidade}
                          onChange={(e) => atualizarIngrediente(ingrediente.id, 'unidade', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="g">gramas (g)</option>
                          <option value="kg">quilos (kg)</option>
                          <option value="ml">mililitros (ml)</option>
                          <option value="l">litros (l)</option>
                          <option value="un">unidade</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço por {ingrediente.unidade}</label>
                        <div className="flex">
                          <CurrencyInput
                            value={ingrediente.precoUnitario}
                            onChange={(value) => atualizarIngrediente(ingrediente.id, 'precoUnitario', value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg"
                            placeholder="0,00"
                          />
                          <button
                            onClick={() => removerIngrediente(ingrediente.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-r-lg hover:bg-red-600"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {ingredientes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum ingrediente adicionado ainda.</p>
                    <p className="text-sm">Use a busca acima ou clique em "Manual" para começar.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Configurações */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações de Custo</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Tempo de preparo (horas)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={tempoPreparoHoras || ''}
                      onChange={(e) => setTempoPreparoHoras(parseFloat(e.target.value) || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="1.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 inline mr-1" />
                      Valor por hora de trabalho
                    </label>
                    <CurrencyInput
                      value={custoHora}
                      onChange={setCustoHora}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="25,00"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custos fixos (energia, gás, embalagem)
                    </label>
                    <CurrencyInput
                      value={custoFixo}
                      onChange={setCustoFixo}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="5,00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Margem de lucro (%)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={margem || 30}
                        onChange={(e) => setMargem(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>0%</span>
                        <span className="font-medium text-pink-600">{margem || 30}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview dos custos */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Preview dos custos:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Ingredientes</p>
                    <p className="font-semibold">{formatCurrency(calcularCustoIngredientes())}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mão de obra</p>
                    <p className="font-semibold">{formatCurrency((tempoPreparoHoras || 0) * (custoHora || 0))}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Custos fixos</p>
                    <p className="font-semibold">{formatCurrency(custoFixo || 0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total + Margem</p>
                    <p className="font-semibold text-pink-600">{formatCurrency(calcularPrecoFinal())}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Resultado */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultado Final</h2>
              
              {/* Preço destacado */}
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Preço Sugerido</h3>
                  <div className="text-5xl font-bold mb-4">{formatCurrency(calcularPrecoFinal())}</div>
                  <p className="text-pink-100">Para {nomeReceita || 'sua receita'}</p>
                </div>
              </div>

              {/* Breakdown detalhado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Breakdown de Custos</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ingredientes</span>
                      <span className="font-medium">{formatCurrency(calcularCustoIngredientes())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mão de obra ({tempoPreparoHoras}h × {formatCurrency(custoHora || 0)})</span>
                      <span className="font-medium">{formatCurrency((tempoPreparoHoras || 0) * (custoHora || 0))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Custos fixos</span>
                      <span className="font-medium">{formatCurrency(custoFixo || 0)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(calcularCustoIngredientes() + (tempoPreparoHoras || 0) * (custoHora || 0) + (custoFixo || 0))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Margem ({margem}%)</span>
                      <span className="font-medium text-green-600">+{formatCurrency(calcularPrecoFinal() - (calcularCustoIngredientes() + (tempoPreparoHoras || 0) * (custoHora || 0) + (custoFixo || 0)))}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-pink-600">{formatCurrency(calcularPrecoFinal())}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Cenários de Preço</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Pessimista</span>
                        <p className="text-xs text-gray-600">Margem 15%</p>
                      </div>
                      <span className="font-medium text-red-600">
                        {formatCurrency((calcularCustoIngredientes() + (tempoPreparoHoras || 0) * (custoHora || 0) + (custoFixo || 0)) * 1.15)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Realista</span>
                        <p className="text-xs text-gray-600">Margem {margem}%</p>
                      </div>
                      <span className="font-medium text-pink-600">{formatCurrency(calcularPrecoFinal())}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Otimista</span>
                        <p className="text-xs text-gray-600">Margem 50%</p>
                      </div>
                      <span className="font-medium text-green-600">
                        {formatCurrency((calcularCustoIngredientes() + (tempoPreparoHoras || 0) * (custoHora || 0) + (custoFixo || 0)) * 1.5)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={() => setShowSaveModal(true)}
                  className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Cálculo
                </button>
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </button>
                <button 
                  onClick={() => {
                    setCurrentStep(1)
                    setIngredientes([])
                    setNomeReceita('')
                    setReceitaSelecionada('')
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Novo Cálculo
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg flex items-center ${
                currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </button>
            
            <button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              disabled={currentStep === 4}
              className={`px-6 py-2 rounded-lg flex items-center ${
                currentStep === 4 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}