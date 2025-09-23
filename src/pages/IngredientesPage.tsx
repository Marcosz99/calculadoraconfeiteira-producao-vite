// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Search, Package, AlertTriangle, TrendingUp, Edit, Trash2, DollarSign, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { IngredienteUsuario } from '../types'
import { supabase } from '@/integrations/supabase/client'
import { INGREDIENTES_CONFEITARIA, INGREDIENTES_MAIS_USADOS, CATEGORIAS_INGREDIENTES, IngredienteConfeitaria } from '../data/ingredientes-confeitaria'
import CurrencyInput from '../components/ui/CurrencyInput'
import { useSubscriptionLimits } from '../hooks/useSubscriptionLimits'
import { UpgradeModal } from '../components/UpgradeModal'
import { LimitBadge } from '../components/LimitBadge'

export default function IngredientesPage() {
  const { user } = useAuth()
  const { canAddIngrediente, isProfessional, usage, limits } = useSubscriptionLimits()
  const [ingredientes, setIngredientes] = useState<IngredienteUsuario[]>([])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
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
      
      setIngredientes((data || []) as any[])
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

  const handleAddIngrediente = () => {
    if (!canAddIngrediente()) {
      setShowUpgradeModal(true)
      return
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Verificar limite antes de criar novo ingrediente
    if (!editingIngrediente && !canAddIngrediente()) {
      setShowUpgradeModal(true)
      return
    }

    try {
      const ingredienteData = {
        user_id: user.id,
        nome: formData.nome,
        categoria: formData.categoria,
        preco_medio: formData.preco_atual,
        unidade_padrao: formData.unidade,
        estoque: formData.modo_receitas ? null : formData.estoque_atual,
        data_ultima_compra: null,
        fornecedor: formData.fornecedor || null
      }

      if (editingIngrediente) {
        const { data, error } = await supabase
          .from('ingredientes_usuario')
          .update(ingredienteData)
          .eq('id', editingIngrediente.id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) throw error

        // @ts-ignore - Database schema mismatch
        setIngredientes(prev => prev.map(i => i.id === editingIngrediente.id ? data : i))
      } else {
        const { data, error } = await supabase
          .from('ingredientes_usuario')
          .insert(ingredienteData)
          .select()
          .single()

        if (error) throw error

        // @ts-ignore - Database schema mismatch
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
      preco_atual: ingrediente.preco_medio || 0,
      unidade: ingrediente.unidade_padrao || 'kg',
      categoria: ingrediente.categoria,
      fornecedor: ingrediente.fornecedor || '',
      estoque_atual: ingrediente.estoque || 0,
      estoque_minimo: 0,
      modo_receitas: false
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
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddIngrediente}
                className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={!isProfessional && !canAddIngrediente()}
              >
                <Plus className="h-5 w-5" />
                <span>Novo Ingrediente</span>
              </button>
              {!isProfessional && <LimitBadge type="ingredientes" />}
            </div>
            
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
                {filteredIngredientes.map(ingrediente => (
                  <tr key={ingrediente.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ingrediente.nome}</div>
                        <div className="text-sm text-gray-500">{ingrediente.categoria}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R$ {(Number(ingrediente.preco_medio) || 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">por {ingrediente.unidade_padrao}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ingrediente.estoque !== undefined ? (
                        <div className="text-sm text-gray-900">
                          {ingrediente.estoque} {ingrediente.unidade_padrao}
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
                ))}
              </tbody>
            </table>
          </div>

          {filteredIngredientes.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum ingrediente encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece adicionando seus primeiros ingredientes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Novo/Editar Ingrediente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingIngrediente ? 'Editar Ingrediente' : 'Novo Ingrediente'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Ingrediente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço Atual *
                    </label>
                    <CurrencyInput
                      value={formData.preco_atual}
                      onChange={(valor) => setFormData(prev => ({ ...prev, preco_atual: valor }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidade *
                    </label>
                    <select
                      value={formData.unidade}
                      onChange={(e) => setFormData(prev => ({ ...prev, unidade: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="kg">Quilograma (kg)</option>
                      <option value="g">Grama (g)</option>
                      <option value="l">Litro (l)</option>
                      <option value="ml">Mililitro (ml)</option>
                      <option value="unidade">Unidade</option>
                      <option value="xícara">Xícara</option>
                      <option value="colher sopa">Colher de sopa</option>
                      <option value="colher chá">Colher de chá</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fornecedor
                  </label>
                  <input
                    type="text"
                    value={formData.fornecedor}
                    onChange={(e) => setFormData(prev => ({ ...prev, fornecedor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do fornecedor"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
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
                    {editingIngrediente ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature="ingredientes"
          currentUsage={usage.ingredientes}
          limit={limits.ingredientes as number}
        />
      )}
    </div>
  )
}