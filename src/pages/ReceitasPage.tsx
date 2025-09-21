import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Search, Filter, Clock, Users, Star, Edit, Trash2, Eye, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Receita, Categoria, ReceitaIngrediente, IngredienteUsuario } from '../types'
import { LOCAL_STORAGE_KEYS, saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage'
import { useSubscriptionLimits } from '../hooks/useSubscriptionLimits'
import { UpgradeModal } from '../components/UpgradeModal'
import { LimitBadge } from '../components/LimitBadge'
import IntelligentIngredientSearch from '../components/ui/IntelligentIngredientSearch'
import { IngredienteConfeitaria, INGREDIENTES_CONFEITARIA } from '../data/ingredientes-confeitaria'

export default function ReceitasPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { canAddReceita, isProfessional, usage, limits } = useSubscriptionLimits()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [ingredientes, setIngredientes] = useState<IngredienteUsuario[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [showModal, setShowModal] = useState(false)
  const [editingReceita, setEditingReceita] = useState<Receita | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    categoria: 'Bolos',
    categoria_id: '',
    modo_preparo: [''],
    tempo_preparo_mins: 60,
    rendimento: '',
    foto_principal: ''
  })
  const [ingredientesReceita, setIngredientesReceita] = useState<ReceitaIngrediente[]>([])

  useEffect(() => {
    if (user) {
      const savedReceitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, [])
      const savedCategorias = getFromLocalStorage<Categoria[]>(LOCAL_STORAGE_KEYS.CATEGORIAS, [])
      const savedIngredientes = getFromLocalStorage<IngredienteUsuario[]>(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [])
      
      setReceitas(savedReceitas.filter(r => r.usuario_id === user.id))
      setCategorias(savedCategorias.filter(c => c.usuario_id === user.id))
      setIngredientes(savedIngredientes.filter(i => i.usuario_id === user.id))
    }
  }, [user])

  const filteredReceitas = receitas.filter(receita => {
    const matchesSearch = receita.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = categoriaFiltro === 'todas' || receita.categoria_id === categoriaFiltro
    
    return matchesSearch && matchesCategoria && receita.ativo
  })

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'iniciante': return 'text-green-600 bg-green-100'
      case 'intermediario': return 'text-yellow-600 bg-yellow-100'
      case 'avancado': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoriaById = (id: string) => {
    return categorias.find(c => c.id === id)
  }

  const deleteReceita = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
      const updatedReceitas = receitas.map(r => 
        r.id === id ? { ...r, ativo: false } : r
      )
      setReceitas(updatedReceitas)
      
      const allReceitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, [])
      const updatedAllReceitas = allReceitas.map(r => 
        r.id === id ? { ...r, ativo: false } : r
      )
      saveToLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS, updatedAllReceitas)
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      categoria: 'Bolos',
      categoria_id: '',
      modo_preparo: [''],
      tempo_preparo_mins: 60,
      rendimento: '',
      foto_principal: ''
    })
    setIngredientesReceita([])
    setEditingReceita(null)
    setShowModal(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.nome.trim()) return

    const receitaData: Receita = {
      id: editingReceita?.id || Date.now().toString(),
      usuario_id: user.id,
      categoria_id: formData.categoria_id || (formData.categoria === 'Bolos' ? 'cat_bolos' : 'cat_' + formData.categoria.toLowerCase()),
      nome: formData.nome.trim(),
      descricao: '',
      modo_preparo: formData.modo_preparo.filter(step => step.trim()),
      tempo_preparo_mins: formData.tempo_preparo_mins,
      rendimento: formData.rendimento.trim(),
      dificuldade: formData.tempo_preparo_mins <= 30 ? 'iniciante' : formData.tempo_preparo_mins <= 120 ? 'intermediario' : 'avancado',
      foto_principal: formData.foto_principal,
      ingredientes: ingredientesReceita,
      tags: [formData.categoria.toLowerCase()],
      ativo: true,
      criado_em: editingReceita?.criado_em || new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    }

    let updatedReceitas
    if (editingReceita) {
      updatedReceitas = receitas.map(r => 
        r.id === editingReceita.id ? receitaData : r
      )
    } else {
      updatedReceitas = [...receitas, receitaData]
    }

    setReceitas(updatedReceitas)

    // Salvar todas as receitas
    const allReceitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, [])
    const otherUsersReceitas = allReceitas.filter(r => r.usuario_id !== user.id)
    saveToLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS, [...otherUsersReceitas, ...updatedReceitas])

    resetForm()
  }

  const editReceita = (receita: Receita) => {
    setFormData({
      nome: receita.nome,
      categoria: receita.categoria_id ? categorias.find(c => c.id === receita.categoria_id)?.nome || 'Bolos' : 'Bolos',
      categoria_id: receita.categoria_id,
      modo_preparo: receita.modo_preparo.length > 0 ? receita.modo_preparo : [''],
      tempo_preparo_mins: receita.tempo_preparo_mins,
      rendimento: receita.rendimento,
      foto_principal: receita.foto_principal || ''
    })
    setIngredientesReceita(receita.ingredientes)
    setEditingReceita(receita)
    setShowModal(true)
  }

  // Adicionar ingrediente do sistema inteligente
  const adicionarIngredienteInteligente = (ingrediente: IngredienteConfeitaria) => {
    const novoIngrediente: ReceitaIngrediente = {
      id: Date.now().toString(),
      receita_id: '',
      ingrediente_id: ingrediente.id,
      quantidade: 0,
      unidade: ingrediente.unidade_padrao,
      observacoes: '',
      ordem: ingredientesReceita.length
    }
    setIngredientesReceita([...ingredientesReceita, novoIngrediente])
  }

  const adicionarIngrediente = () => {
    const novoIngrediente: ReceitaIngrediente = {
      id: Date.now().toString(),
      receita_id: '',
      ingrediente_id: '',
      quantidade: 0,
      unidade: 'g',
      observacoes: '',
      ordem: ingredientesReceita.length
    }
    setIngredientesReceita([...ingredientesReceita, novoIngrediente])
  }

  const removerIngrediente = (index: number) => {
    setIngredientesReceita(ingredientesReceita.filter((_, i) => i !== index))
  }

  const atualizarIngrediente = (index: number, campo: keyof ReceitaIngrediente, valor: any) => {
    const novosIngredientes = [...ingredientesReceita]
    novosIngredientes[index] = { ...novosIngredientes[index], [campo]: valor }
    setIngredientesReceita(novosIngredientes)
  }

  const adicionarModosPreparo = () => {
    setFormData({
      ...formData,
      modo_preparo: [...formData.modo_preparo, '']
    })
  }

  const removerModoPreparo = (index: number) => {
    setFormData({
      ...formData,
      modo_preparo: formData.modo_preparo.filter((_, i) => i !== index)
    })
  }

  const atualizarModoPreparo = (index: number, valor: string) => {
    const novosModos = [...formData.modo_preparo]
    novosModos[index] = valor
    setFormData({
      ...formData,
      modo_preparo: novosModos
    })
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
                Minhas Receitas
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Gerencie suas receitas e organize seus doces
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                if (canAddReceita()) {
                  setShowModal(true)
                } else {
                  setShowUpgradeModal(true)
                }
              }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                canAddReceita() 
                  ? 'bg-pink-500 text-white hover:bg-pink-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Nova Receita</span>
            </button>
            
            <LimitBadge type="receitas" />
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-card p-4 lg:p-6 rounded-lg shadow-md mb-6 lg:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar receitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="todas">Todas as categorias</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
            
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Filter className="h-5 w-5" />
              <span>{filteredReceitas.length} receitas encontradas</span>
            </div>
          </div>
        </div>

        {/* Lista de Receitas */}
        {filteredReceitas.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Star className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {receitas.length === 0 ? 'Nenhuma receita cadastrada' : 'Nenhuma receita encontrada'}
            </h3>
            <p className="text-gray-500 mb-6">
              {receitas.length === 0 
                ? 'Comece criando sua primeira receita!' 
                : 'Tente ajustar os filtros para encontrar o que procura.'
              }
            </p>
            {receitas.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Criar primeira receita
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {filteredReceitas.map(receita => {
              const categoria = getCategoriaById(receita.categoria_id)
              
              return (
                <div key={receita.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    {receita.foto_principal ? (
                      <img 
                        src={receita.foto_principal} 
                        alt={receita.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl">{categoria?.icone || '🍰'}</div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 truncate">
                        {receita.nome}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editReceita(receita)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteReceita(receita.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{receita.tempo_preparo_mins}min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{receita.rendimento}</span>
                        </div>
                      </div>
                      
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getCategoriaById(receita.categoria_id)?.nome || 'Outros'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: categoria?.cor_hex || '#gray' }}
                        ></span>
                        <span className="text-sm text-gray-600">{categoria?.nome}</span>
                      </div>
                      
                    </div>
                    
                    {receita.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {receita.tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {receita.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{receita.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full m-4 max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingReceita ? 'Editar Receita' : 'Nova Receita'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Receita *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Ex: Brigadeiro Gourmet"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    >
                      <option value="Bolos">Bolos</option>
                      <option value="Doces">Doces</option>
                      <option value="Salgados">Salgados</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo de Preparo: {Math.floor(formData.tempo_preparo_mins / 60)}h {formData.tempo_preparo_mins % 60}min
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="240"
                      step="15"
                      value={formData.tempo_preparo_mins}
                      onChange={(e) => setFormData({...formData, tempo_preparo_mins: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>15min</span>
                      <span>2h</span>
                      <span>4h</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rendimento *
                    </label>
                    <input
                      type="text"
                      value={formData.rendimento}
                      onChange={(e) => setFormData({...formData, rendimento: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Ex: 12 porções, 1 bolo grande"
                      required
                    />
                  </div>
                </div>

                {/* Sistema Inteligente de Busca de Ingredientes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Ingredientes *
                  </label>
                  
                  {/* Busca Inteligente */}
                  <IntelligentIngredientSearch
                    onAddIngredient={adicionarIngredienteInteligente}
                    selectedIngredients={ingredientesReceita}
                    className="mb-6"
                  />
                  
                  {/* Lista de Ingredientes Adicionados */}
                  {ingredientesReceita.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Ingredientes da Receita ({ingredientesReceita.length})
                      </h4>
                      {ingredientesReceita.map((ingrediente, index) => {
                        // Buscar o nome do ingrediente da base de dados
                        const ingredienteInfo = ingredientes.find(ing => ing.id === ingrediente.ingrediente_id) ||
                                               INGREDIENTES_CONFEITARIA.find(ing => ing.id === ingrediente.ingrediente_id)
                        
                        return (
                          <div key={index} className="border border-gray-200 p-3 rounded-lg bg-gray-50">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                              <div className="sm:col-span-2">
                                <p className="font-medium text-gray-900 text-sm">
                                  {ingredienteInfo?.nome || 'Ingrediente desconhecido'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {ingredienteInfo?.categoria || 'Categoria não definida'}
                                </p>
                              </div>
                              
                              <div>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={ingrediente.quantidade}
                                  onChange={(e) => atualizarIngrediente(index, 'quantidade', parseFloat(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="Quantidade"
                                />
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <select
                                  value={ingrediente.unidade}
                                  onChange={(e) => atualizarIngrediente(index, 'unidade', e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="g">g</option>
                                  <option value="kg">kg</option>
                                  <option value="ml">ml</option>
                                  <option value="l">l</option>
                                  <option value="xícara">xícara</option>
                                  <option value="colher de sopa">colher de sopa</option>
                                  <option value="colher de chá">colher de chá</option>
                                  <option value="unidade">unidade</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => removerIngrediente(index)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Modo de Preparo */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Modo de Preparo
                    </label>
                    <button
                      type="button"
                      onClick={adicionarModosPreparo}
                      className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Adicionar Passo</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.modo_preparo.map((passo, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <textarea
                          value={passo}
                          onChange={(e) => atualizarModoPreparo(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                          rows={2}
                          placeholder={`Passo ${index + 1}...`}
                        />
                        {formData.modo_preparo.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removerModoPreparo(index)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>


                
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
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                  >
                    {editingReceita ? 'Salvar Alterações' : 'Criar Receita'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="receitas"
        onUpgrade={(method) => {
          if (method === 'pix') {
            navigate('/upgrade/pix')
          } else {
            navigate('/upgrade/stripe')
          }
        }}
      />
    </div>
  )
}