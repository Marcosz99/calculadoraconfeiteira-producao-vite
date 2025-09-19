import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Store, Settings, Share2, QrCode, Eye, Plus, Image, Save, ArrowLeft, ExternalLink } from 'lucide-react'
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import { Receita, ProdutoCatalogo, DadosConfeitaria } from '../types'
import QRCodeGenerator from '../components/QRCodeGenerator'

export default function MeuCatalogoPage() {
  const { user, updatePerfil } = useAuth()
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [produtosCatalogo, setProdutosCatalogo] = useState<ProdutoCatalogo[]>([])
  const [dadosConfeitaria, setDadosConfeitaria] = useState<DadosConfeitaria>({
    nomeFantasia: '',
    whatsapp: '',
    instagram: '',
    endereco: '',
    descricao: ''
  })
  const [catalogoAtivo, setCatalogoAtivo] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [loading, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      // Carrega receitas usando a chave correta do localStorage
      const receitasData = getFromLocalStorage<Receita[]>('doce_receitas', [])
        .filter(r => r.usuario_id === user.id && r.ativo)
      
      const produtosData = getFromLocalStorage<ProdutoCatalogo[]>(`produtos_catalogo_${user.id}`, [])
      const confeitariaData = getFromLocalStorage<DadosConfeitaria>(`dados_confeitaria_${user.id}`, {
        nomeFantasia: user.nome || '',
        whatsapp: '',
        instagram: '',
        endereco: '',
        descricao: ''
      })
      
      setReceitas(receitasData)
      setProdutosCatalogo(produtosData)
      setDadosConfeitaria(confeitariaData)
      setCatalogoAtivo(user.catalogo_ativo || false)
    }
  }, [user])

  const handleToggleReceita = (receita: Receita) => {
    const produtoExiste = produtosCatalogo.find(p => p.receita_id === receita.id)
    
    if (produtoExiste) {
      // Remove do catálogo
      const novosProdutos = produtosCatalogo.filter(p => p.receita_id !== receita.id)
      setProdutosCatalogo(novosProdutos)
    } else {
      // Adiciona ao catálogo
      const novoProduto: ProdutoCatalogo = {
        id: `produto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        receita_id: receita.id,
        nome: receita.nome,
        preco_publico: receita.preco_sugerido || 0,
        descricao_publica: receita.descricao,
        categoria: receita.categoria_id,
        serve: receita.rendimento,
        prazo_entrega: '24 horas',
        ativo: true,
        personalizavel: false,
        criado_em: new Date().toISOString()
      }
      setProdutosCatalogo([...produtosCatalogo, novoProduto])
    }
  }

  const handleUpdateProduto = (produtoId: string, campo: string, valor: any) => {
    const produtosAtualizados = produtosCatalogo.map(p => 
      p.id === produtoId ? { ...p, [campo]: valor } : p
    )
    setProdutosCatalogo(produtosAtualizados)
  }

  const salvarCatalogo = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      // Salva dados no localStorage
      saveToLocalStorage(`produtos_catalogo_${user.id}`, produtosCatalogo)
      saveToLocalStorage(`dados_confeitaria_${user.id}`, dadosConfeitaria)
      
      // Atualiza dados do usuário no localStorage
      const urlCatalogo = `${window.location.origin}/catalogo/${user.id}`
      const userAtualizado = {
        ...user,
        catalogo_ativo: catalogoAtivo,
        url_catalogo: urlCatalogo,
        dados_confeitaria: dadosConfeitaria
      }
      saveToLocalStorage(`user_${user.id}`, userAtualizado)
      
      alert('Catálogo salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar catálogo:', error)
      alert('Erro ao salvar catálogo')
    } finally {
      setSaving(false)
    }
  }

  const copiarLink = () => {
    const link = `${window.location.origin}/catalogo/${user?.id}`
    navigator.clipboard.writeText(link)
    alert('Link copiado para a área de transferência!')
  }

  const produtosNoCatalogo = produtosCatalogo.filter(p => p.ativo)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <Store className="h-8 w-8 text-blue-600" />
                  <span>Meu Catálogo</span>
                </h1>
                <p className="text-gray-600 mt-2">Configure seu catálogo público para receber encomendas online</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={copiarLink}
                className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Copiar Link</span>
              </button>
              
              <button
                onClick={() => setShowQRCode(true)}
                className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <QrCode className="h-4 w-4" />
                <span>QR Code</span>
              </button>
              
              <Link
                to={`/catalogo/${user?.id}`}
                target="_blank"
                className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Visualizar</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configurações da Confeitaria */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Dados da Confeitaria</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Confeitaria</label>
                  <input
                    type="text"
                    value={dadosConfeitaria.nomeFantasia}
                    onChange={(e) => setDadosConfeitaria({...dadosConfeitaria, nomeFantasia: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome que aparecerá no catálogo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={dadosConfeitaria.whatsapp}
                    onChange={(e) => setDadosConfeitaria({...dadosConfeitaria, whatsapp: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={dadosConfeitaria.instagram}
                    onChange={(e) => setDadosConfeitaria({...dadosConfeitaria, instagram: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="@suaconfeitaria"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <input
                    type="text"
                    value={dadosConfeitaria.endereco}
                    onChange={(e) => setDadosConfeitaria({...dadosConfeitaria, endereco: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cidade, Bairro"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={dadosConfeitaria.descricao}
                    onChange={(e) => setDadosConfeitaria({...dadosConfeitaria, descricao: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Conte sobre sua confeitaria..."
                  />
                </div>
              </div>
            </div>

          {/* Status do Catálogo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Status do Catálogo</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={catalogoAtivo}
                  onChange={(e) => setCatalogoAtivo(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Ativo</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-3 ${
                catalogoAtivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {catalogoAtivo ? '✅ Catálogo Público Ativo' : '❌ Catálogo Inativo'}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {produtosNoCatalogo.length} produto(s) selecionado(s)
              </p>
              
              {!catalogoAtivo && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-yellow-700">
                    ⚠️ <strong>Atenção:</strong> Seu catálogo está inativo. 
                    Marque como "Ativo" e salve para torná-lo público.
                  </p>
                </div>
              )}
              
              {catalogoAtivo && produtosNoCatalogo.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    💡 Selecione algumas receitas abaixo para aparecerem no seu catálogo público.
                  </p>
                </div>
              )}
            </div>
          </div>
          </div>

          {/* Seleção de Produtos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Selecionar Produtos para o Catálogo</span>
              </h3>
              
              {receitas.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Você ainda não tem receitas criadas.</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Crie algumas receitas primeiro para poder adicioná-las ao seu catálogo.
                  </p>
                  <Link 
                    to="/receitas" 
                    className="inline-flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Criar primeira receita</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-700">
                      <strong>💡 Como funciona:</strong> Selecione as receitas que deseja mostrar no seu catálogo público. 
                      Você pode personalizar preços e descrições para cada produto.
                    </p>
                  </div>

                  {receitas.map((receita) => {
                    const produtoNoCatalogo = produtosCatalogo.find(p => p.receita_id === receita.id)
                    
                    return (
                      <div 
                        key={receita.id} 
                        className={`border-2 rounded-xl p-6 transition-all duration-200 ${
                          produtoNoCatalogo 
                            ? 'border-green-200 bg-green-50/50 shadow-md' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={!!produtoNoCatalogo}
                                onChange={() => handleToggleReceita(receita)}
                                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              {produtoNoCatalogo && (
                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-bounce-in"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg">{receita.nome}</h4>
                              <p className="text-gray-600 mt-1">{receita.descricao}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  Serve: {receita.rendimento}
                                </span>
                                {receita.preco_sugerido && (
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                    Preço calculado: R$ {receita.preco_sugerido.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {produtoNoCatalogo && (
                            <div className="text-green-600 font-medium text-sm bg-green-100 px-3 py-1 rounded-full">
                              ✓ No catálogo
                            </div>
                          )}
                        </div>
                        
                        {produtoNoCatalogo && (
                          <div className="mt-6 pt-6 border-t border-green-200 animate-fade-in">
                            <h5 className="font-medium text-gray-900 mb-4">Configurações do Produto</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  💰 Preço Público
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                                  <input
                                    type="number"
                                    value={produtoNoCatalogo.preco_publico}
                                    onChange={(e) => handleUpdateProduto(produtoNoCatalogo.id, 'preco_publico', parseFloat(e.target.value) || 0)}
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  ⏰ Prazo de Entrega
                                </label>
                                <select
                                  value={produtoNoCatalogo.prazo_entrega}
                                  onChange={(e) => handleUpdateProduto(produtoNoCatalogo.id, 'prazo_entrega', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                  <option value="24 horas">24 horas</option>
                                  <option value="48 horas">48 horas</option>
                                  <option value="3 dias">3 dias</option>
                                  <option value="1 semana">1 semana</option>
                                  <option value="Sob consulta">Sob consulta</option>
                                </select>
                              </div>
                              
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  📝 Descrição Pública
                                </label>
                                <textarea
                                  value={produtoNoCatalogo.descricao_publica}
                                  onChange={(e) => handleUpdateProduto(produtoNoCatalogo.id, 'descricao_publica', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  rows={3}
                                  placeholder="Descrição que aparecerá no catálogo público para os clientes..."
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={salvarCatalogo}
            disabled={loading}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-lg font-semibold transition-all duration-200 ${
              catalogoAtivo && produtosNoCatalogo.length > 0
                ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:shadow-lg hover-scale'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Save className="h-5 w-5" />
            <span>{loading ? 'Salvando...' : 'Salvar Catálogo'}</span>
          </button>
          
          {catalogoAtivo && produtosNoCatalogo.length > 0 && (
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium">
                🎉 Seu catálogo está pronto para receber encomendas!
              </p>
            </div>
          )}
        </div>

        {/* QR Code Modal */}
        {user && (
          <QRCodeGenerator
            url={`${window.location.origin}/catalogo/${user.id}`}
            title={dadosConfeitaria.nomeFantasia || user.nome}
            isOpen={showQRCode}
            onClose={() => setShowQRCode(false)}
          />
        )}
      </div>
    </div>
  )
}