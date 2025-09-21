import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Search, Package, AlertTriangle, TrendingUp, Edit, Trash2, DollarSign, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { IngredienteUsuario } from '../types'
import { supabase } from '@/integrations/supabase/client'
import { INGREDIENTES_CONFEITARIA, INGREDIENTES_MAIS_USADOS, CATEGORIAS_INGREDIENTES, IngredienteConfeitaria } from '../data/ingredientes-confeitaria'
import CurrencyInput from '../components/ui/CurrencyInput'

export default function IngredientesPage() {
  const { user } = useAuth()
  const [ingredientes, setIngredientes] = useState<IngredienteUsuario[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [showModal, setShowModal] = useState(false)
  const [showIngredientesPopulares, setShowIngredientesPopulares] = useState(false)
  const [showOvoModal, setShowOvoModal] = useState(false)
  const [searchIngredientesPopulares, setSearchIngredientesPopulares] = useState('')
  const [ovoData, setOvoData] = useState({ valorPago: 0, quantidade: 0 })
  const [editingIngrediente, setEditingIngrediente] = useState<IngredienteUsuario | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    preco_atual: 0,
    unidade: 'kg',
    categoria: 'Outros',
    fornecedor: '',
    estoque_atual: 0,
    estoque_minimo: 0,
    modo_receitas: false
  })

  useEffect(() => {
    if (user) {
      loadIngredientesFromSupabase()
    }
  }, [user])

  const loadIngredientesFromSupabase = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('ingredientes_usuario')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true })
      
      if (error) throw error
      
      setIngredientes(data || [])
    } catch (error) {
      console.error('Erro ao carregar ingredientes:', error)
    }
  }

  const categorias = CATEGORIAS_INGREDIENTES

  const filteredIngredientes = ingredientes.filter(ingrediente => {
    const matchesSearch = ingrediente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = categoriaFiltro === 'todas' || ingrediente.categoria === categoriaFiltro
    return matchesSearch && matchesCategoria
  })

  const ingredientesEstoqueBaixo = ingredientes.filter(i => 
    !i.modo_receitas &&
    i.estoque_atual !== undefined && 
    i.estoque_minimo !== undefined && 
    i.estoque_atual <= i.estoque_minimo
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const ingredienteData = {
        user_id: user.id,
        nome: formData.nome,
        preco_atual: formData.preco_atual,
        preco_anterior: editingIngrediente?.preco_atual || null,
        unidade: formData.unidade,
        categoria: formData.categoria,
        fornecedor: formData.fornecedor || null,
        estoque_atual: formData.modo_receitas ? null : formData.estoque_atual,
        estoque_minimo: formData.modo_receitas ? null : formData.estoque_minimo,
        modo_receitas: formData.modo_receitas,
        observacoes: null
      }

      if (editingIngrediente) {
        // Atualizar ingrediente existente
        const { data, error } = await supabase
          .from('ingredientes_usuario')
          .update(ingredienteData)
          .eq('id', editingIngrediente.id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) throw error

        setIngredientes(prev => prev.map(i => i.id === editingIngrediente.id ? data : i))
      } else {
        // Criar novo ingrediente
        const { data, error } = await supabase
          .from('ingredientes_usuario')
          .insert(ingredienteData)
          .select()
          .single()

        if (error) throw error

        setIngredientes(prev => [data, ...prev])
      }

      resetForm()
      alert(editingIngrediente ? '✅ Ingrediente atualizado!' : '✅ Ingrediente criado!')
    } catch (error) {
      console.error('Erro ao salvar ingrediente:', error)
      alert('❌ Erro ao salvar ingrediente. Tente novamente.')
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      preco_atual: 0,
      unidade: 'kg',
      categoria: 'Outros',
      fornecedor: '',
      estoque_atual: 0,
      estoque_minimo: 0,
      modo_receitas: false
    })
    setEditingIngrediente(null)
    setShowModal(false)
  }

  const editIngrediente = (ingrediente: IngredienteUsuario) => {
    setFormData({
      nome: ingrediente.nome,
      preco_atual: ingrediente.preco_atual,
      unidade: ingrediente.unidade,
      categoria: ingrediente.categoria,
      fornecedor: ingrediente.fornecedor || '',
      estoque_atual: ingrediente.estoque_atual || 0,
      estoque_minimo: ingrediente.estoque_minimo || 0,
      modo_receitas: ingrediente.modo_receitas || false
    })
    setEditingIngrediente(ingrediente)
    setShowModal(true)
  }

  const deleteIngrediente = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este ingrediente?')) return

    try {
      const { error } = await supabase
        .from('ingredientes_usuario')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      setIngredientes(prev => prev.filter(i => i.id !== id))
      alert('✅ Ingrediente excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir ingrediente:', error)
      alert('❌ Erro ao excluir ingrediente. Tente novamente.')
    }
  }

  const adicionarIngredientePopular = (ingrediente: IngredienteConfeitaria) => {
    if (!user) return

    // Verificar se é ovo - abrir modal especial
    if (ingrediente.id === 'ovos') {
      setShowOvoModal(true)
      setShowIngredientesPopulares(false)
      return
    }

    // Preencher o formulário com os dados do ingrediente
    setFormData({
      nome: ingrediente.nome,
      preco_atual: 0, // Deixar vazio para o usuário preencher
      unidade: ingrediente.unidade_padrao,
      categoria: ingrediente.categoria,
      fornecedor: '',
      estoque_atual: 0,
      estoque_minimo: 0,
      modo_receitas: false
    })
    
    setEditingIngrediente(null)
    setShowIngredientesPopulares(false)
    setShowModal(true)
  }

  const handleOvoSubmit = async () => {
    if (!user || ovoData.valorPago <= 0 || ovoData.quantidade <= 0) return

    const precoUnitario = ovoData.valorPago / ovoData.quantidade

    try {
      const novoIngrediente = {
        user_id: user.id,
        nome: 'Ovos',
        preco_atual: precoUnitario,
        unidade: 'unidade',
        categoria: 'Ovos',
        observacoes: null
      }

      const { data, error } = await supabase
        .from('ingredientes_usuario')
        .insert(novoIngrediente)
        .select()
        .single()

      if (error) throw error

      setIngredientes(prev => [data, ...prev])
      
      setShowOvoModal(false)
      setShowIngredientesPopulares(false)
      setOvoData({ valorPago: 0, quantidade: 0 })
      alert('✅ Ingrediente ovo adicionado com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar ingrediente ovo:', error)
      alert('❌ Erro ao adicionar ingrediente. Tente novamente.')
    }
  }

  const ingredientesPopularesFiltrados = INGREDIENTES_CONFEITARIA
    .filter(ing => INGREDIENTES_MAIS_USADOS.includes(ing.id))
    .filter(ing => 
      searchIngredientesPopulares === '' || 
      ing.nome.toLowerCase().includes(searchIngredientesPopulares.toLowerCase()) ||
      ing.categoria.toLowerCase().includes(searchIngredientesPopulares.toLowerCase())
    )
    .filter(ing => !ingredientes.some(i => i.nome.toLowerCase() === ing.nome.toLowerCase()))

  const getVariacaoPreco = (ingrediente: IngredienteUsuario) => {
    if (!ingrediente.preco_anterior) return null
    
    const variacao = ((ingrediente.preco_atual - ingrediente.preco_anterior) / ingrediente.preco_anterior) * 100
    return variacao
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 lg:mb-2">
                Ingredientes & Estoque
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Gerencie preços e controle seu estoque
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Ingrediente</span>
            </button>
            
            <button
              onClick={() => setShowIngredientesPopulares(true)}
              className="flex items-center space-x-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Star className="h-5 w-5" />
              <span>Ingredientes Populares</span>
            </button>
          </div>
        </div>

        {/* Alertas */}
        {ingredientesEstoqueBaixo.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>{ingredientesEstoqueBaixo.length} ingredientes</strong> com estoque baixo precisam de reposição.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-card p-4 lg:p-6 rounded-lg shadow-md mb-6 lg:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar ingredientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas as categorias</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Package className="h-5 w-5" />
              <span>{filteredIngredientes.length} ingredientes</span>
            </div>
          </div>
        </div>


        {/* Lista de Ingredientes */}
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingrediente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIngredientes.map(ingrediente => {
                  const variacao = getVariacaoPreco(ingrediente)
                  const estoqueAlerta = !ingrediente.modo_receitas &&
                                       ingrediente.estoque_atual !== undefined && 
                                       ingrediente.estoque_minimo !== undefined && 
                                       ingrediente.estoque_atual <= ingrediente.estoque_minimo

                  return (
                    <tr key={ingrediente.id} className={estoqueAlerta ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{ingrediente.nome}</div>
                          <div className="text-sm text-gray-500">{ingrediente.categoria}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          R$ {ingrediente.preco_atual.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">por {ingrediente.unidade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {variacao !== null && (
                          <div className={`flex items-center text-sm ${
                            variacao > 0 ? 'text-red-600' : variacao < 0 ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            <TrendingUp className={`h-4 w-4 mr-1 ${variacao < 0 ? 'transform rotate-180' : ''}`} />
                            {Math.abs(variacao).toFixed(1)}%
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ingrediente.modo_receitas ? (
                          <span className="text-sm text-blue-600">Modo receitas</span>
                        ) : ingrediente.estoque_atual !== undefined ? (
                          <div className={`text-sm ${estoqueAlerta ? 'text-yellow-600 font-medium' : 'text-gray-900'}`}>
                            {ingrediente.estoque_atual} {ingrediente.unidade}
                            {estoqueAlerta && (
                              <div className="text-xs text-yellow-600">Repor!</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ingrediente.fornecedor || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => editIngrediente(ingrediente)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteIngrediente(ingrediente.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {editingIngrediente ? 'Editar Ingrediente' : 'Novo Ingrediente'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Ingrediente
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Atual
                    </label>
                    <CurrencyInput
                      value={formData.preco_atual}
                      onChange={(value) => setFormData({...formData, preco_atual: value || 0})}
                      className="border-gray-300"
                      placeholder="R$ 0,00"
                      allowEmpty={false}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidade
                    </label>
                    <select
                      value={formData.unidade}
                      onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="kg">Quilos (kg)</option>
                      <option value="g">Gramas (g)</option>
                      <option value="l">Litros (l)</option>
                      <option value="ml">Mililitros (ml)</option>
                      <option value="unidade">Unidade</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categorias.map(categoria => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fornecedor (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.fornecedor}
                    onChange={(e) => setFormData({...formData, fornecedor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="modo-receitas"
                    checked={formData.modo_receitas}
                    onChange={(e) => setFormData({...formData, modo_receitas: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="modo-receitas" className="text-sm font-medium text-gray-700">
                    Modo para receitas: não contabilizará estoque, apenas ficará liberado para receitas
                  </label>
                </div>
                
                {!formData.modo_receitas && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estoque Atual
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.estoque_atual}
                        onChange={(e) => setFormData({...formData, estoque_atual: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estoque Mínimo
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.estoque_minimo}
                        onChange={(e) => setFormData({...formData, estoque_minimo: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {editingIngrediente ? 'Salvar Alterações' : 'Adicionar Ingrediente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Ingredientes Populares */}
        {showIngredientesPopulares && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full m-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ingredientes Mais Utilizados por Confeiteiras
                </h3>
                <button
                  onClick={() => setShowIngredientesPopulares(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar ingredientes..."
                    value={searchIngredientesPopulares}
                    onChange={(e) => setSearchIngredientesPopulares(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ingredientesPopularesFiltrados.map(ingrediente => (
                  <div key={ingrediente.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900">{ingrediente.nome}</h4>
                    <p className="text-sm text-gray-600">{ingrediente.categoria}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      Unidade: {ingrediente.unidade_padrao}
                    </p>
                    <button
                      onClick={() => adicionarIngredientePopular(ingrediente)}
                      className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                ))}
              </div>
              
              {ingredientesPopularesFiltrados.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum ingrediente encontrado ou todos já foram adicionados.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Para Ovos */}
        {showOvoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Calcular Preço dos Ovos
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quanto você pagou?
                  </label>
                  <CurrencyInput
                    value={ovoData.valorPago}
                    onChange={(value) => setOvoData({...ovoData, valorPago: value || 0})}
                    className="border-gray-300"
                    placeholder="R$ 0,00"
                    allowEmpty={false}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Por quantos ovos?
                  </label>
                  <input
                    type="number"
                    value={ovoData.quantidade}
                    onChange={(e) => setOvoData({...ovoData, quantidade: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 30"
                  />
                </div>
                
                {ovoData.valorPago > 0 && ovoData.quantidade > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700">
                      <strong>Preço por ovo: R$ {(ovoData.valorPago / ovoData.quantidade).toFixed(2)}</strong>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowOvoModal(false)
                    setOvoData({ valorPago: 0, quantidade: 0 })
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleOvoSubmit}
                  disabled={ovoData.valorPago <= 0 || ovoData.quantidade <= 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar Ovos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}