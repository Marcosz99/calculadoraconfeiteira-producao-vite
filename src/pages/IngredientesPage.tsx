import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Search, Package, AlertTriangle, TrendingUp, Edit, Trash2, DollarSign } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { IngredienteUsuario } from '../types'
import { LOCAL_STORAGE_KEYS, saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage'
import { ingredientesSistema } from '../data/ingredientes-sistema'

export default function IngredientesPage() {
  const { user } = useAuth()
  const [ingredientes, setIngredientes] = useState<IngredienteUsuario[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [showModal, setShowModal] = useState(false)
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
      const savedIngredientes = getFromLocalStorage<IngredienteUsuario[]>(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [])
      setIngredientes(savedIngredientes.filter(i => i.usuario_id === user.id))
    }
  }, [user])

  const categorias = [...new Set(ingredientesSistema.map(i => i.categoria))]

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const ingredienteData: IngredienteUsuario = {
      id: editingIngrediente?.id || Date.now().toString(),
      usuario_id: user.id,
      nome: formData.nome,
      preco_atual: formData.preco_atual,
      preco_anterior: editingIngrediente?.preco_atual,
      unidade: formData.unidade,
      categoria: formData.categoria,
      fornecedor: formData.fornecedor,
      estoque_atual: formData.modo_receitas ? undefined : formData.estoque_atual,
      estoque_minimo: formData.modo_receitas ? undefined : formData.estoque_minimo,
      modo_receitas: formData.modo_receitas,
      data_atualizacao: new Date().toISOString()
    }

    let updatedIngredientes
    if (editingIngrediente) {
      updatedIngredientes = ingredientes.map(i => 
        i.id === editingIngrediente.id ? ingredienteData : i
      )
    } else {
      updatedIngredientes = [...ingredientes, ingredienteData]
    }

    setIngredientes(updatedIngredientes)

    // Salvar todos os ingredientes
    const allIngredientes = getFromLocalStorage<IngredienteUsuario[]>(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [])
    const otherUsersIngredientes = allIngredientes.filter(i => i.usuario_id !== user.id)
    saveToLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [...otherUsersIngredientes, ...updatedIngredientes])

    resetForm()
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

  const deleteIngrediente = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este ingrediente?')) {
      const updatedIngredientes = ingredientes.filter(i => i.id !== id)
      setIngredientes(updatedIngredientes)
      
      const allIngredientes = getFromLocalStorage<IngredienteUsuario[]>(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [])
      const updatedAllIngredientes = allIngredientes.filter(i => i.id !== id)
      saveToLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, updatedAllIngredientes)
    }
  }

  const adicionarIngredienteSistema = (ingredienteSistema: any) => {
    if (!user) return

    const novoIngrediente: IngredienteUsuario = {
      id: Date.now().toString(),
      usuario_id: user.id,
      ingrediente_sistema_id: ingredienteSistema.id,
      nome: ingredienteSistema.nome,
      preco_atual: ingredienteSistema.preco_medio_nacional,
      unidade: ingredienteSistema.unidade_padrao,
      categoria: ingredienteSistema.categoria,
      data_atualizacao: new Date().toISOString()
    }

    const updatedIngredientes = [...ingredientes, novoIngrediente]
    setIngredientes(updatedIngredientes)

    const allIngredientes = getFromLocalStorage<IngredienteUsuario[]>(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [])
    const otherUsersIngredientes = allIngredientes.filter(i => i.usuario_id !== user.id)
    saveToLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [...otherUsersIngredientes, ...updatedIngredientes])
  }

  const getVariacaoPreco = (ingrediente: IngredienteUsuario) => {
    if (!ingrediente.preco_anterior) return null
    
    const variacao = ((ingrediente.preco_atual - ingrediente.preco_anterior) / ingrediente.preco_anterior) * 100
    return variacao
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard"
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Ingredientes & Estoque
              </h1>
              <p className="text-gray-600">
                Gerencie preços e controle seu estoque
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Ingrediente</span>
          </button>
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
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Sugestões de Ingredientes do Sistema */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredientes Sugeridos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ingredientesSistema.slice(0, 8).map(ingrediente => {
              const jaAdicionado = ingredientes.some(i => i.ingrediente_sistema_id === ingrediente.id)
              
              return (
                <div key={ingrediente.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{ingrediente.nome}</h4>
                  <p className="text-sm text-gray-600">{ingrediente.categoria}</p>
                  <p className="text-sm font-medium text-green-600 mb-2">
                    R$ {ingrediente.preco_medio_nacional.toFixed(2)}/{ingrediente.unidade_padrao}
                  </p>
                  <button
                    onClick={() => adicionarIngredienteSistema(ingrediente)}
                    disabled={jaAdicionado}
                    className={`w-full px-3 py-1 rounded text-sm ${
                      jaAdicionado 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {jaAdicionado ? 'Já adicionado' : 'Adicionar'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Lista de Ingredientes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                      Preço Atual (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.preco_atual}
                      onChange={(e) => setFormData({...formData, preco_atual: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
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
      </div>
    </div>
  )
}