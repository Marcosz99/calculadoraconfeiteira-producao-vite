import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calculator, Plus, Minus, Save, History, Download, PieChart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { IngredienteUsuario, Receita, CalculoPreco } from '../types'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage'

interface Ingrediente {
  id: string
  nome: string
  quantidade: number
  unidade: string
  precoUnitario: number
}

export default function CalculadoraPage() {
  const { user } = useAuth()
  const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState<IngredienteUsuario[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [nomeReceita, setNomeReceita] = useState('')
  const [receitaSelecionada, setReceitaSelecionada] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [historico, setHistorico] = useState<CalculoPreco[]>([])
  const [showHistorico, setShowHistorico] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
  
  useEffect(() => {
    if (user) {
      const savedIngredientes = getFromLocalStorage<IngredienteUsuario[]>(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [])
      const savedReceitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, [])
      const savedHistorico = getFromLocalStorage<CalculoPreco[]>('doce_historico_calculos', [])
      
      setIngredientesDisponiveis(savedIngredientes.filter(i => i.usuario_id === user.id))
      setReceitas(savedReceitas.filter(r => r.usuario_id === user.id && r.ativo))
      setHistorico(savedHistorico)
    }
  }, [user])

  const [margem, setMargem] = useState(30)
  const [custoFixo, setCustoFixo] = useState(5.00)
  const [custoMaoObra, setCustoMaoObra] = useState(0)
  const [tempoPreparoHoras, setTempoPreparoHoras] = useState(1)
  const [custoHora, setCustoHora] = useState(25)

  const [showAddModal, setShowAddModal] = useState(false)
  const [tipoAdicao, setTipoAdicao] = useState<'manual' | 'lista'>('manual')
  const [ingredienteSelecionado, setIngredienteSelecionado] = useState('')

  const adicionarIngrediente = () => {
    setShowAddModal(true)
  }

  const adicionarIngredienteManual = () => {
    const novoIngrediente: Ingrediente = {
      id: Date.now().toString(),
      nome: '',
      quantidade: 0,
      unidade: 'g',
      precoUnitario: 0
    }
    setIngredientes([...ingredientes, novoIngrediente])
    setShowAddModal(false)
  }

  const adicionarIngredienteDaLista = () => {
    if (!ingredienteSelecionado) return
    
    const ingredienteRef = ingredientesDisponiveis.find(i => i.id === ingredienteSelecionado)
    if (ingredienteRef) {
      const novoIngrediente: Ingrediente = {
        id: Date.now().toString(),
        nome: ingredienteRef.nome,
        quantidade: 0,
        unidade: ingredienteRef.unidade,
        precoUnitario: ingredienteRef.preco_atual
      }
      setIngredientes([...ingredientes, novoIngrediente])
    }
    setShowAddModal(false)
    setIngredienteSelecionado('')
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
    const custoMaoObraTotal = tempoPreparoHoras * custoHora
    const custoTotal = custoIngredientes + custoFixo + custoMaoObraTotal
    return custoTotal * (1 + margem / 100)
  }
  
  const salvarCalculo = () => {
    if (!user) return
    
    const calculo: CalculoPreco = {
      receita_id: nomeReceita || 'Cálculo Manual',
      custo_ingredientes: calcularCustoIngredientes(),
      custo_fixo: custoFixo,
      custo_mao_obra: tempoPreparoHoras * custoHora,
      margem_lucro: margem,
      preco_final: calcularPrecoFinal(),
      breakdown: ingredientes.map(ing => ({
        ingrediente_id: ing.id,
        nome: ing.nome,
        quantidade: ing.quantidade,
        custo: ing.quantidade * ing.precoUnitario
      }))
    }
    
    const novoHistorico = [calculo, ...historico.slice(0, 9)] // Manter apenas 10 cálculos
    setHistorico(novoHistorico)
    saveToLocalStorage('doce_historico_calculos', novoHistorico)
    
    if (nomeReceita) {
      setShowSaveModal(false)
      alert('Cálculo salvo no histórico!')
    }
  }
  
  const carregarReceita = (receitaId: string) => {
    const receita = receitas.find(r => r.id === receitaId)
    if (receita && receita.ingredientes) {
      const novosIngredientes = receita.ingredientes.map(ri => {
        const ingredienteUser = ingredientesDisponiveis.find(iu => iu.id === ri.ingrediente_id)
        return {
          id: ri.id,
          nome: ingredienteUser?.nome || 'Ingrediente não encontrado',
          quantidade: ri.quantidade,
          unidade: ri.unidade,
          precoUnitario: ingredienteUser?.preco_atual || 0
        }
      })
      setIngredientes(novosIngredientes)
      setNomeReceita(receita.nome)
    }
  }
  
  const exportarCalculo = () => {
    const relatorio = {
      nome: nomeReceita || 'Cálculo DoceCalc',
      data: new Date().toLocaleDateString('pt-BR'),
      ingredientes: ingredientes.map(ing => ({
        nome: ing.nome,
        quantidade: ing.quantidade,
        unidade: ing.unidade,
        preco_unitario: ing.precoUnitario,
        custo_total: ing.quantidade * ing.precoUnitario
      })),
      custos: {
        ingredientes: calcularCustoIngredientes(),
        fixo: custoFixo,
        mao_obra: tempoPreparoHoras * custoHora,
        total: calcularCustoIngredientes() + custoFixo + (tempoPreparoHoras * custoHora)
      },
      margem_lucro: margem,
      preco_final: calcularPrecoFinal()
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(relatorio, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `calculo-${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
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
              <div className="flex items-center space-x-2">
                <select
                  value={receitaSelecionada}
                  onChange={(e) => {
                    setReceitaSelecionada(e.target.value)
                    if (e.target.value) carregarReceita(e.target.value)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Carregar receita existente</option>
                  {receitas.map(receita => (
                    <option key={receita.id} value={receita.id}>
                      {receita.nome}
                    </option>
                  ))}
                </select>
                <button
                  onClick={adicionarIngrediente}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {ingredientes.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhum ingrediente adicionado</p>
                  <button
                    onClick={adicionarIngrediente}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Primeiro Ingrediente</span>
                  </button>
                </div>
              ) : (
                ingredientes.map((ingrediente, index) => (
                  <div key={ingrediente.id} className="border border-gray-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">
                        Ingrediente #{index + 1}
                      </span>
                      <button
                        onClick={() => removerIngrediente(ingrediente.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={ingrediente.nome}
                            onChange={(e) => atualizarIngrediente(ingrediente.id, 'nome', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Açúcar"
                            list={`ingredientes-${ingrediente.id}`}
                          />
                          <datalist id={`ingredientes-${ingrediente.id}`}>
                            {ingredientesDisponiveis.map(ing => (
                              <option key={ing.id} value={ing.nome} />
                            ))}
                          </datalist>
                        </div>
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
                ))
              )}
            </div>
          </div>

          {/* Cálculo */}
          <div className="space-y-6">
            {/* Configurações */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo de Preparo (horas)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={tempoPreparoHoras}
                      onChange={(e) => setTempoPreparoHoras(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custo/Hora (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={custoHora}
                      onChange={(e) => setCustoHora(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
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
                  <span className="text-gray-600">Mão de Obra ({tempoPreparoHoras}h x R${custoHora}):</span>
                  <span className="font-medium">R$ {(tempoPreparoHoras * custoHora).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">R$ {(calcularCustoIngredientes() + custoFixo + (tempoPreparoHoras * custoHora)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margem ({margem}%):</span>
                  <span className="font-medium">R$ {((calcularCustoIngredientes() + custoFixo + (tempoPreparoHoras * custoHora)) * (margem / 100)).toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Preço Final:</span>
                  <span className="text-green-600">R$ {calcularPrecoFinal().toFixed(2)}</span>
                </div>
                
                <div className="flex flex-col space-y-2 pt-4">
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <PieChart className="h-4 w-4" />
                    <span>{showBreakdown ? 'Ocultar' : 'Ver'} Breakdown</span>
                  </button>
                  
                  {showBreakdown && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <h4 className="font-medium text-gray-700 mb-2">Breakdown por Ingrediente:</h4>
                      {ingredientes.map(ing => (
                        <div key={ing.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{ing.nome} ({ing.quantidade}{ing.unidade}):</span>
                          <span>R$ {(ing.quantidade * ing.precoUnitario).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="flex items-center justify-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Save className="h-3 w-3" />
                      <span>Salvar</span>
                    </button>
                    
                    <button
                      onClick={() => setShowHistorico(true)}
                      className="flex items-center justify-center space-x-1 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                    >
                      <History className="h-3 w-3" />
                      <span>Histórico</span>
                    </button>
                    
                    <button
                      onClick={exportarCalculo}
                      className="flex items-center justify-center space-x-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <Download className="h-3 w-3" />
                      <span>Exportar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal Salvar */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Salvar Cálculo
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Cálculo
                  </label>
                  <input
                    type="text"
                    value={nomeReceita}
                    onChange={(e) => setNomeReceita(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Bolo de Chocolate - Festa 50 pessoas"
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={salvarCalculo}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal Histórico */}
        {showHistorico && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Histórico de Cálculos
              </h3>
              
              {historico.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum cálculo salvo ainda</p>
              ) : (
                <div className="space-y-4">
                  {historico.map((calc, index) => (
                    <div key={index} className="border border-gray-200 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{calc.receita_id}</h4>
                        <span className="text-xl font-bold text-green-600">
                          R$ {calc.preco_final.toFixed(2)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="block">Ingredientes:</span>
                          <span className="font-medium">R$ {calc.custo_ingredientes.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="block">Mão de Obra:</span>
                          <span className="font-medium">R$ {calc.custo_mao_obra.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="block">Margem:</span>
                          <span className="font-medium">{calc.margem_lucro}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowHistorico(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Adicionar Ingrediente */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Adicionar Ingrediente</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Como você deseja adicionar?
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tipoAdicao"
                        value="lista"
                        checked={tipoAdicao === 'lista'}
                        onChange={(e) => setTipoAdicao(e.target.value as 'manual' | 'lista')}
                        className="mr-2"
                      />
                      <span>Da minha lista de ingredientes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tipoAdicao"
                        value="manual"
                        checked={tipoAdicao === 'manual'}
                        onChange={(e) => setTipoAdicao(e.target.value as 'manual' | 'lista')}
                        className="mr-2"
                      />
                      <span>Manualmente</span>
                    </label>
                  </div>
                </div>

                {tipoAdicao === 'lista' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selecione um ingrediente:
                    </label>
                    <select
                      value={ingredienteSelecionado}
                      onChange={(e) => setIngredienteSelecionado(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Escolha um ingrediente</option>
                      {ingredientesDisponiveis.map(ing => (
                        <option key={ing.id} value={ing.id}>
                          {ing.nome} - R$ {ing.preco_atual.toFixed(3)}/{ing.unidade}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {tipoAdicao === 'lista' && ingredientesDisponiveis.length === 0 && (
                  <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded">
                    Você ainda não tem ingredientes cadastrados. 
                    <Link to="/ingredientes" className="text-blue-500 hover:text-blue-700">
                      Cadastre alguns aqui primeiro
                    </Link> ou adicione manualmente.
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setTipoAdicao('manual')
                    setIngredienteSelecionado('')
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={tipoAdicao === 'lista' ? adicionarIngredienteDaLista : adicionarIngredienteManual}
                  disabled={tipoAdicao === 'lista' && !ingredienteSelecionado}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}