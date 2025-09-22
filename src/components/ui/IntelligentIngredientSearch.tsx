/**
 * Componente inteligente de busca de ingredientes
 * Implementa sistema avançado com categorias, autocomplete e histórico
 */

import React, { useState, useEffect, useMemo } from 'react'
import { Search, Plus, X, Star, Clock } from 'lucide-react'
import { INGREDIENTES_CONFEITARIA, CATEGORIAS_INGREDIENTES, IngredienteConfeitaria } from '../../data/ingredientes-confeitaria'
import { IngredienteUsuario, ReceitaIngrediente } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage'

interface IntelligentIngredientSearchProps {
  onAddIngredient: (ingrediente: IngredienteConfeitaria) => void
  selectedIngredients?: ReceitaIngrediente[]
  className?: string
}

interface HistoricoUso {
  ingrediente_id: string
  contador: number
  ultima_utilizacao: string
}

const IntelligentIngredientSearch: React.FC<IntelligentIngredientSearchProps> = ({
  onAddIngredient,
  selectedIngredients = [],
  className = ""
}) => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [isExpanded, setIsExpanded] = useState(false)
  const [historicoUso, setHistoricoUso] = useState<HistoricoUso[]>([])
  const [ingredientesUsuario, setIngredientesUsuario] = useState<IngredienteUsuario[]>([])

  // Carregar histórico de uso e ingredientes do usuário
  useEffect(() => {
    if (user) {
      const historico = getFromLocalStorage<HistoricoUso[]>(`doce_historico_ingredientes_${user.id}`, [])
      const ingredientesUser = getFromLocalStorage<IngredienteUsuario[]>(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [])
      
      setHistoricoUso(historico)
      setIngredientesUsuario(ingredientesUser.filter(i => i.usuario_id === user.id))
    }
  }, [user])

  // Ingredientes filtrados e ordenados por relevância
  const filteredIngredients = useMemo(() => {
    let ingredientes = INGREDIENTES_CONFEITARIA

    // Filtrar por categoria
    if (selectedCategory !== 'Todos') {
      ingredientes = ingredientes.filter(ing => ing.categoria === selectedCategory)
    }

    // Filtrar por busca
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      ingredientes = ingredientes.filter(ing => 
        ing.nome.toLowerCase().includes(searchLower) ||
        ing.categoria.toLowerCase().includes(searchLower)
      )
    }

    // Excluir ingredientes já selecionados
    const idsJaSelecionados = selectedIngredients.map(si => si.ingrediente_id)
    ingredientes = ingredientes.filter(ing => !idsJaSelecionados.includes(ing.id))

    // Ordenar por relevância (histórico de uso + popularidade)
    return ingredientes.sort((a, b) => {
      const usoA = historicoUso.find(h => h.ingrediente_id === a.id)?.contador || 0
      const usoB = historicoUso.find(h => h.ingrediente_id === b.id)?.contador || 0
      
      // Primeiro por uso pessoal, depois por nome
      if (usoA !== usoB) return usoB - usoA
      return a.nome.localeCompare(b.nome)
    })
  }, [searchTerm, selectedCategory, selectedIngredients, historicoUso])

  // Ingredientes mais usados (top 5)
  const maisUsados = useMemo(() => {
    return INGREDIENTES_CONFEITARIA
      .filter(ing => {
        const idsJaSelecionados = selectedIngredients.map(si => si.ingrediente_id)
        return !idsJaSelecionados.includes(ing.id)
      })
      .map(ing => ({
        ...ing,
        uso: historicoUso.find(h => h.ingrediente_id === ing.id)?.contador || 0
      }))
      .sort((a, b) => b.uso - a.uso)
      .slice(0, 5)
      .filter(ing => ing.uso > 0)
  }, [historicoUso, selectedIngredients])

  // Registrar uso de ingrediente
  const registrarUsoIngrediente = (ingredienteId: string) => {
    if (!user) return

    const novoHistorico = [...historicoUso]
    const index = novoHistorico.findIndex(h => h.ingrediente_id === ingredienteId)
    
    if (index >= 0) {
      novoHistorico[index].contador += 1
      novoHistorico[index].ultima_utilizacao = new Date().toISOString()
    } else {
      novoHistorico.push({
        ingrediente_id: ingredienteId,
        contador: 1,
        ultima_utilizacao: new Date().toISOString()
      })
    }
    
    setHistoricoUso(novoHistorico)
    saveToLocalStorage(`doce_historico_ingredientes_${user.id}`, novoHistorico)
  }

  // Adicionar ingrediente
  const handleAddIngredient = (ingrediente: IngredienteConfeitaria) => {
    onAddIngredient(ingrediente)
    registrarUsoIngrediente(ingrediente.id)
    
    // Limpar busca após adicionar
    setSearchTerm('')
  }

  // Obter preço do ingrediente (do usuário ou padrão)
  const getPrecoIngrediente = (ingrediente: IngredienteConfeitaria): number => {
    const ingredienteUser = ingredientesUsuario.find(iu => iu.nome.toLowerCase() === ingrediente.nome.toLowerCase())
    return ingredienteUser?.preco_atual || ingrediente.preco_medio_nacional
  }

  // Categorias disponíveis
  const categorias = ['Todos', ...CATEGORIAS_INGREDIENTES]

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header com busca */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Buscar ingredientes (ex: farinha, açúcar...)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
        </div>

        {/* Categorias */}
        {isExpanded && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {categorias.map(categoria => (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => setSelectedCategory(categoria)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === categoria
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo expandido */}
      {isExpanded && (
        <div className="p-4">
          {/* Ingredientes mais usados */}
          {!searchTerm && maisUsados.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Mais usados por você</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {maisUsados.map(ingrediente => (
                  <div
                    key={ingrediente.id}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{ingrediente.nome}</h4>
                        <p className="text-xs text-gray-500">{ingrediente.categoria}</p>
                        <p className="text-xs text-green-600 mt-1">
                          R$ {getPrecoIngrediente(ingrediente).toFixed(4)}/{ingrediente.unidade_padrao}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500">{ingrediente.uso} vezes</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddIngredient(ingrediente)}
                        className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de ingredientes filtrados */}
          <div>
            {searchTerm && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  {filteredIngredients.length} ingredientes encontrados
                </span>
                {filteredIngredients.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Fechar
                  </button>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {filteredIngredients.slice(0, 12).map(ingrediente => {
                const uso = historicoUso.find(h => h.ingrediente_id === ingrediente.id)?.contador || 0
                
                return (
                  <div
                    key={ingrediente.id}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{ingrediente.nome}</h4>
                        <p className="text-xs text-gray-500">{ingrediente.categoria}</p>
                        <p className="text-xs text-green-600 mt-1">
                          R$ {getPrecoIngrediente(ingrediente).toFixed(4)}/{ingrediente.unidade_padrao}
                        </p>
                        {uso > 0 && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">{uso} vezes</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddIngredient(ingrediente)}
                        className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredIngredients.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">
                  Nenhum ingrediente encontrado para "{searchTerm}"
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Tente buscar por nome ou categoria
                </p>
              </div>
            )}
          </div>

          {/* Botão para fechar quando expandido */}
          {(searchTerm || maisUsados.length > 0) && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false)
                  setSearchTerm('')
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Fechar busca
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default IntelligentIngredientSearch