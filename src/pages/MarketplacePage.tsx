import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, ShoppingCart, Star, Clock, Crown, Filter, BookOpen, Download } from 'lucide-react'
import { ebooks, categories, getCart, saveCart, getUserLibrary, simulatePurchase } from '../data/ebooks-mock'
import { EBook, CartItem } from '../types/ebooks'
import { useCredits } from '../hooks/useCredits'

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'relevancia' | 'preco-menor' | 'preco-maior' | 'avaliacoes'>('relevancia')
  const [cart, setCart] = useState<CartItem[]>([])
  const [library, setLibrary] = useState<any>(null)
  const [showCart, setShowCart] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const { remainingCredits } = useCredits()

  useEffect(() => {
    setCart(getCart())
    setLibrary(getUserLibrary())
  }, [])

  const filteredEbooks = ebooks
    .filter(ebook => {
      const matchesCategory = selectedCategory === 'all' || ebook.categoria === selectedCategory
      const matchesSearch = ebook.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ebook.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ebook.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'preco-menor':
          return a.preco - b.preco
        case 'preco-maior':
          return b.preco - a.preco
        case 'avaliacoes':
          return b.avaliacoes - a.avaliacoes
        default:
          return b.bestseller ? 1 : -1
      }
    })

  const addToCart = (ebook: EBook) => {
    const existingItem = cart.find(item => item.ebookId === ebook.id)
    let newCart
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.ebookId === ebook.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    } else {
      newCart = [...cart, { ebookId: ebook.id, ebook, quantidade: 1 }]
    }
    
    setCart(newCart)
    saveCart(newCart)
  }

  const removeFromCart = (ebookId: string) => {
    const newCart = cart.filter(item => item.ebookId !== ebookId)
    setCart(newCart)
    saveCart(newCart)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.ebook.preco * item.quantidade), 0)
  }

  const getTotalCredits = () => {
    return cart.reduce((total, item) => total + (item.ebook.precoCreditos * item.quantidade), 0)
  }

  const handlePurchase = async (paymentMethod: 'creditos' | 'dinheiro') => {
    if (cart.length === 0) return
    
    setPurchasing(true)
    try {
      const ebookIds = cart.map(item => item.ebookId)
      const result = await simulatePurchase(ebookIds, paymentMethod)
      
      if (result.success) {
        setCart([])
        setShowCart(false)
        setLibrary(getUserLibrary())
        alert('Compra realizada com sucesso! Os e-books foram adicionados à sua biblioteca.')
      }
    } catch (error) {
      alert('Erro ao processar compra. Tente novamente.')
    } finally {
      setPurchasing(false)
    }
  }

  const isInLibrary = (ebookId: string) => {
    return library?.ebooks?.some((item: any) => item.ebookId === ebookId)
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Marketplace de E-books</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Créditos: {remainingCredits}</span>
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar com filtros */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Filtros</h3>
              
              {/* Busca */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Título, autor ou tag..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categorias */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      selectedCategory === 'all' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Todas as categorias
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                        selectedCategory === category.id ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{category.icone}</span>
                      {category.nome} ({category.totalEbooks})
                    </button>
                  ))}
                </div>
              </div>

              {/* Ordenação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="relevancia">Relevância</option>
                  <option value="preco-menor">Menor preço</option>
                  <option value="preco-maior">Maior preço</option>
                  <option value="avaliacoes">Melhor avaliado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de e-books */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredEbooks.length} e-book(s) encontrado(s)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEbooks.map(ebook => (
                <div key={ebook.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {ebook.bestseller && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {categories.find(c => c.id === ebook.categoria)?.nome}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{ebook.titulo}</h3>
                        <p className="text-sm text-gray-600 mb-2">por {ebook.autor}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ebook.resumo}</p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {ebook.avaliacoes} ({ebook.numeroAvaliacoes})
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {ebook.paginas}p
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          {ebook.promocao ? (
                            <div>
                              <span className="text-lg font-bold text-orange-600">
                                R$ {ebook.preco.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                R$ {ebook.promocao.precoOriginal.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              R$ {ebook.preco.toFixed(2)}
                            </span>
                          )}
                          <div className="text-sm text-orange-600">
                            ou {ebook.precoCreditos} créditos
                          </div>
                        </div>
                      </div>

                      {isInLibrary(ebook.id) ? (
                        <div className="flex items-center justify-center py-2 bg-green-100 text-green-700 rounded-lg">
                          <Download className="h-4 w-4 mr-2" />
                          Na sua biblioteca
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(ebook)}
                          className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Adicionar ao carrinho
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal do carrinho */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Carrinho de Compras</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-600">Seu carrinho está vazio</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.ebookId} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.ebook.titulo}</h4>
                        <p className="text-sm text-gray-600">R$ {item.ebook.preco.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.ebookId)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Total:</span>
                    <div className="text-right">
                      <div className="font-semibold">R$ {getTotalPrice().toFixed(2)}</div>
                      <div className="text-sm text-orange-600">{getTotalCredits()} créditos</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handlePurchase('dinheiro')}
                      disabled={purchasing}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {purchasing ? 'Processando...' : 'Comprar com Dinheiro'}
                    </button>
                    <button
                      onClick={() => handlePurchase('creditos')}
                      disabled={purchasing || remainingCredits < getTotalCredits()}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                    >
                      {purchasing ? 'Processando...' : 'Comprar com Créditos'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}