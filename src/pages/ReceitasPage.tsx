import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Search, Filter, Clock, Users, Star, Edit, Trash2, Eye } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Receita, Categoria } from '../types'
import { LOCAL_STORAGE_KEYS, saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage'

export default function ReceitasPage() {
  const { user } = useAuth()
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [dificuldadeFiltro, setDificuldadeFiltro] = useState('todas')
  const [showModal, setShowModal] = useState(false)
  const [editingReceita, setEditingReceita] = useState<Receita | null>(null)

  useEffect(() => {
    if (user) {
      const savedReceitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, [])
      const savedCategorias = getFromLocalStorage<Categoria[]>(LOCAL_STORAGE_KEYS.CATEGORIAS, [])
      
      setReceitas(savedReceitas.filter(r => r.usuario_id === user.id))
      setCategorias(savedCategorias.filter(c => c.usuario_id === user.id))
    }
  }, [user])

  const filteredReceitas = receitas.filter(receita => {
    const matchesSearch = receita.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receita.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = categoriaFiltro === 'todas' || receita.categoria_id === categoriaFiltro
    const matchesDificuldade = dificuldadeFiltro === 'todas' || receita.dificuldade === dificuldadeFiltro
    
    return matchesSearch && matchesCategoria && matchesDificuldade && receita.ativo
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
                Minhas Receitas
              </h1>
              <p className="text-gray-600">
                Gerencie suas receitas e organize seus doces
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Receita</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            
            <select
              value={dificuldadeFiltro}
              onChange={(e) => setDificuldadeFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="todas">Todas as dificuldades</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          onClick={() => {
                            setEditingReceita(receita)
                            setShowModal(true)
                          }}
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
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {receita.descricao}
                    </p>
                    
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
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDificuldadeColor(receita.dificuldade)}`}>
                        {receita.dificuldade}
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
                      
                      {receita.preco_sugerido && (
                        <span className="text-lg font-bold text-green-600">
                          R$ {receita.preco_sugerido.toFixed(2)}
                        </span>
                      )}
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
      </div>
    </div>
  )
}