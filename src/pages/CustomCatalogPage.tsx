// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save, Eye, QrCode, Share2, Upload, Palette, Type, Layout, ShoppingBag, ToggleLeft, ToggleRight, Plus, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Receita, ProdutoCatalogo } from '../types'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import { useSupabaseReceitas } from '../hooks/useSupabaseReceitas'
import QRCodeGenerator from '../components/QRCodeGenerator'

interface CatalogoBranding {
  id: string
  usuario_id: string
  nome_confeitaria: string
  logo_url?: string
  cor_primaria: string
  cor_secundaria: string
  fonte: string
  layout: 'grid' | 'lista' | 'magazine'
  elementos_visuais: {
    bordas_decorativas: boolean
    icones_tematicos: boolean
    patterns_fundo: boolean
    separadores: boolean
  }
  configuracoes: {
    mostrar_precos: boolean
    mostrar_descricoes: boolean
    contato_whatsapp: string
    texto_cabecalho: string
  }
  criado_em: string
  atualizado_em: string
}

const FONTES_DISPONIVEIS = [
  { id: 'inter', nome: 'Moderna', classe: 'font-sans' },
  { id: 'serif', nome: 'Elegante', classe: 'font-serif' },
  { id: 'rounded', nome: 'Divertida', classe: 'font-mono' },
  { id: 'times', nome: 'Clássica', classe: 'font-serif' },
  { id: 'handwritten', nome: 'Artesanal', classe: 'font-mono' },
  { id: 'clean', nome: 'Clean', classe: 'font-sans' }
]

const CORES_SUGERIDAS = [
  '#FF6B9D', '#FF8E3C', '#FFD23F', '#06FFA5', '#4ECDC4', 
  '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
]

export default function CustomCatalogPage() {
  const { user, profile } = useAuth()
  const { receitas, loading: receitasLoading } = useSupabaseReceitas()
  const [activeTab, setActiveTab] = useState<'design' | 'produtos'>('design')
  const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([])
  const [showQRModal, setShowQRModal] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorType, setColorType] = useState<'primaria' | 'secundaria'>('primaria')
  const [customColor, setCustomColor] = useState('#FF6B9D')
  const [showPreview, setShowPreview] = useState(false)

  // Função de upload da logo
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem')
      return
    }
    
    // Validar tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 2MB')
      return
    }
    
    // Converter para base64 (simulação de upload)
    const reader = new FileReader()
    reader.onload = (e) => {
      const logoUrl = e.target?.result as string
      setBranding(prev => ({ ...prev, logo_url: logoUrl }))
    }
    reader.readAsDataURL(file)
  }
  
  const [branding, setBranding] = useState<CatalogoBranding>({
    id: '',
    usuario_id: user?.id || '',
    nome_confeitaria: profile?.nome_negocio || 'Minha Confeitaria',
    cor_primaria: '#FF6B9D',
    cor_secundaria: '#FFF',
    fonte: 'inter',
    layout: 'grid',
    elementos_visuais: {
      bordas_decorativas: false,
      icones_tematicos: true,
      patterns_fundo: false,
      separadores: true
    },
    configuracoes: {
      mostrar_precos: true,
      mostrar_descricoes: true,
      contato_whatsapp: profile?.whatsapp || '',
      texto_cabecalho: 'Confira nossos deliciosos produtos!'
    },
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  })

  useEffect(() => {
    if (user) {
      // Carregar configurações de branding salvas
      const savedBranding = getFromLocalStorage<CatalogoBranding[]>('catalogo_branding', [])
      const userBranding = savedBranding.find(b => b.usuario_id === user.id)
      
      if (userBranding) {
        setBranding(userBranding)
      }
      
      // Carregar produtos do catálogo
      const savedProdutos = getFromLocalStorage<ProdutoCatalogo[]>('catalogo_produtos', [])
      setProdutos(savedProdutos.filter(p => p.usuario_id === user.id))
    }
  }, [user, profile, receitas]) // Adicionando receitas como dependência

  const salvarBranding = () => {
    if (!user) return
    
    const brandingAtualizado = {
      ...branding,
      id: branding.id || Date.now().toString(),
      usuario_id: user.id,
      atualizado_em: new Date().toISOString()
    }
    
    setBranding(brandingAtualizado)
    
    const allBranding = getFromLocalStorage<CatalogoBranding[]>('catalogo_branding', [])
    const otherUsersBranding = allBranding.filter(b => b.usuario_id !== user.id)
    saveToLocalStorage('catalogo_branding', [...otherUsersBranding, brandingAtualizado])
    
    alert('✅ Configurações de branding salvas!')
  }

  const toggleProduto = (receitaId: string) => {
    const receita = receitas.find(r => r.id === receitaId)
    if (!receita || !user) return
    
    const produtoExistente = produtos.find(p => p.receita_id === receitaId)
    
    if (produtoExistente) {
      // Alternar status ativo/inativo (preservar dados)
      const produtosAtualizados = produtos.map(p => 
        p.receita_id === receitaId ? { ...p, ativo: !p.ativo } : p
      )
      setProdutos(produtosAtualizados)
      
      const allProdutos = getFromLocalStorage<ProdutoCatalogo[]>('catalogo_produtos', [])
      const otherUsersProdutos = allProdutos.filter(p => p.usuario_id !== user.id)
      saveToLocalStorage('catalogo_produtos', [...otherUsersProdutos, ...produtosAtualizados])
    } else {
      // Criar novo produto
      const novoProduto: ProdutoCatalogo = {
        id: Date.now().toString(),
        usuario_id: user.id,
        receita_id: receitaId,
        nome: receita.nome,
        foto: receita.foto_principal || '',
        preco_publico: 0,
        descricao_publica: '',
        categoria: receita.categoria || 'Doces',
        serve: receita.rendimento,
        prazo_entrega: '2-3 dias',
        ativo: true,
        personalizavel: false,
        criado_em: new Date().toISOString()
      }
      
      const produtosAtualizados = [...produtos, novoProduto]
      setProdutos(produtosAtualizados)
      
      const allProdutos = getFromLocalStorage<ProdutoCatalogo[]>('catalogo_produtos', [])
      const otherUsersProdutos = allProdutos.filter(p => p.usuario_id !== user.id)
      saveToLocalStorage('catalogo_produtos', [...otherUsersProdutos, ...produtosAtualizados])
    }
  }

  const atualizarProduto = (produtoId: string, campo: string, valor: any) => {
    const produtosAtualizados = produtos.map(p => 
      p.id === produtoId ? { ...p, [campo]: valor } : p
    )
    setProdutos(produtosAtualizados)
    
    if (user) {
      const allProdutos = getFromLocalStorage<ProdutoCatalogo[]>('catalogo_produtos', [])
      const otherUsersProdutos = allProdutos.filter(p => p.usuario_id !== user.id)
      saveToLocalStorage('catalogo_produtos', [...otherUsersProdutos, ...produtosAtualizados])
    }
  }

  const aplicarCor = () => {
    setBranding(prev => ({
      ...prev,
      [colorType === 'primaria' ? 'cor_primaria' : 'cor_secundaria']: customColor
    }))
    setShowColorPicker(false)
  }

  const gerarLinkCatalogo = () => {
    return `${window.location.origin}/catalogo-publico?user=${user?.id}`
  }

  const produtosAtivos = produtos.filter(p => p.ativo)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Catálogo Personalizado</h1>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setShowQRModal(true)}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                <QrCode className="h-4 w-4" />
                <span>QR Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'design'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Palette className="h-4 w-4 inline mr-2" />
              Personalização
            </button>
            <button
              onClick={() => setActiveTab('produtos')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'produtos'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingBag className="h-4 w-4 inline mr-2" />
              Produtos
            </button>
          </div>
        </div>

        {/* Design Tab */}
        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configurações */}
            <div className="space-y-6">
              {/* Nome da Confeitaria */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo da Confeitaria
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          {branding.logo_url ? (
                            <img 
                              src={branding.logo_url} 
                              alt="Logo" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Upload className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {branding.logo_url ? 'Trocar Logo' : 'Adicionar Logo'}
                        </label>
                        {branding.logo_url && (
                          <button
                            onClick={() => setBranding(prev => ({ ...prev, logo_url: '' }))}
                            className="ml-2 text-red-500 hover:text-red-700 text-sm"
                          >
                            Remover
                          </button>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG até 2MB. Recomendado: 200x200px
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Confeitaria
                    </label>
                    <input
                      type="text"
                      value={branding.nome_confeitaria}
                      onChange={(e) => setBranding(prev => ({ ...prev, nome_confeitaria: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto do Cabeçalho
                    </label>
                    <textarea
                      value={branding.configuracoes.texto_cabecalho}
                      onChange={(e) => setBranding(prev => ({ 
                        ...prev, 
                        configuracoes: { ...prev.configuracoes, texto_cabecalho: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp para Contato
                    </label>
                    <input
                      type="text"
                      value={branding.configuracoes.contato_whatsapp}
                      onChange={(e) => setBranding(prev => ({ 
                        ...prev, 
                        configuracoes: { ...prev.configuracoes, contato_whatsapp: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>

              {/* Cores */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Cores</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Cor Primária
                    </label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                        style={{ backgroundColor: branding.cor_primaria }}
                        onClick={() => {
                          setColorType('primaria')
                          setCustomColor(branding.cor_primaria)
                          setShowColorPicker(true)
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {CORES_SUGERIDAS.map(cor => (
                          <div
                            key={cor}
                            className="w-8 h-8 rounded cursor-pointer border-2 border-gray-200 hover:scale-110 transition-transform"
                            style={{ backgroundColor: cor }}
                            onClick={() => setBranding(prev => ({ ...prev, cor_primaria: cor }))}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Cor Secundária
                    </label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                        style={{ backgroundColor: branding.cor_secundaria }}
                        onClick={() => {
                          setColorType('secundaria')
                          setCustomColor(branding.cor_secundaria)
                          setShowColorPicker(true)
                        }}
                      />
                      <input
                        type="text"
                        value={branding.cor_secundaria}
                        onChange={(e) => setBranding(prev => ({ ...prev, cor_secundaria: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fontes */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Tipografia</h3>
                <div className="grid grid-cols-2 gap-3">
                  {FONTES_DISPONIVEIS.map(fonte => (
                    <button
                      key={fonte.id}
                      onClick={() => setBranding(prev => ({ ...prev, fonte: fonte.id }))}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        branding.fonte === fonte.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-bold ${fonte.classe}`}>
                        {fonte.nome}
                      </div>
                      <div className={`text-sm text-gray-600 ${fonte.classe}`}>
                        Exemplo de texto
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Elementos Visuais */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Elementos Visuais</h3>
                <div className="space-y-3">
                  {Object.entries(branding.elementos_visuais).map(([key, value]) => {
                    const labels = {
                      bordas_decorativas: 'Bordas Decorativas',
                      icones_tematicos: 'Ícones Temáticos',
                      patterns_fundo: 'Patterns de Fundo',
                      separadores: 'Separadores'
                    }
                    
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {labels[key as keyof typeof labels]}
                        </span>
                        <button
                          onClick={() => setBranding(prev => ({
                            ...prev,
                            elementos_visuais: {
                              ...prev.elementos_visuais,
                              [key]: !value
                            }
                          }))}
                          className="focus:outline-none"
                        >
                          {value ? (
                            <ToggleRight className="h-6 w-6 text-purple-500" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-gray-400" />
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={salvarBranding}
                className="w-full flex items-center justify-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
              >
                <Save className="h-5 w-5" />
                <span>Salvar Configurações</span>
              </button>
            </div>

            {/* Preview */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Preview do Catálogo</h3>
              <div 
                className="border border-gray-200 rounded-lg p-6 min-h-96"
                style={{ 
                  backgroundColor: branding.cor_secundaria,
                  borderColor: branding.cor_primaria
                }}
              >
                <div className="text-center mb-6">
                  {/* Logo */}
                  {branding.logo_url && (
                    <div className="mb-4 flex justify-center">
                      <img 
                        src={branding.logo_url} 
                        alt={branding.nome_confeitaria}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                  
                  <h2 
                    className="text-2xl font-bold mb-2"
                    style={{ color: branding.cor_primaria }}
                  >
                    {branding.nome_confeitaria}
                  </h2>
                  <p className="text-gray-600">
                    {branding.configuracoes.texto_cabecalho}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {produtosAtivos.slice(0, 4).map(produto => (
                    <div key={produto.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="bg-gray-100 rounded h-20 mb-2 flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="font-medium text-sm">{produto.nome}</h4>
                      {branding.configuracoes.mostrar_precos && (
                        <p 
                          className="text-sm font-bold"
                          style={{ color: branding.cor_primaria }}
                        >
                          R$ {produto.preco_publico.toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                {produtosAtivos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Adicione produtos na aba "Produtos"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Produtos Tab */}
        {activeTab === 'produtos' && (
          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Gerenciar Produtos do Catálogo</h3>
                <p className="text-gray-600 mt-1">
                  Ative/desative receitas no catálogo e configure informações específicas
                </p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {receitas.map(receita => {
                  const produto = produtos.find(p => p.receita_id === receita.id)
                  const isAtivo = produto?.ativo || false
                  const temProduto = !!produto
                  
                  return (
                    <div key={receita.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                              isAtivo ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              <ShoppingBag className={`h-8 w-8 ${
                                isAtivo ? 'text-green-500' : 'text-gray-400'
                              }`} />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-medium text-gray-900">
                                {receita.nome}
                              </h4>
                              {isAtivo && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Ativo
                                </span>
                              )}
                              {temProduto && !isAtivo && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                  Inativo
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {receita.categoria} • {receita.rendimento}
                            </p>
                            
                            {temProduto && produto && (
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Preço Público
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={produto.preco_publico}
                                    onChange={(e) => atualizarProduto(produto.id, 'preco_publico', parseFloat(e.target.value) || 0)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                    placeholder="0.00"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prazo de Entrega
                                  </label>
                                  <input
                                    type="text"
                                    value={produto.prazo_entrega}
                                    onChange={(e) => atualizarProduto(produto.id, 'prazo_entrega', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                    placeholder="2-3 dias"
                                  />
                                </div>
                                
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descrição Pública
                                  </label>
                                  <textarea
                                    value={produto.descricao_publica}
                                    onChange={(e) => atualizarProduto(produto.id, 'descricao_publica', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                    rows={2}
                                    placeholder="Descrição que aparecerá no catálogo público"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => toggleProduto(receita.id)}
                            className="focus:outline-none"
                            title={isAtivo ? 'Desativar do catálogo' : 'Ativar no catálogo'}
                          >
                            {isAtivo ? (
                              <ToggleRight className="h-8 w-8 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-8 w-8 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {receitas.length === 0 && (
                  <div className="p-12 text-center">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma receita encontrada
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Crie algumas receitas primeiro para adicioná-las ao catálogo
                    </p>
                    <Link
                      to="/receitas"
                      className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Receita
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Color Picker */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Escolher Cor {colorType === 'primaria' ? 'Primária' : 'Secundária'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor Personalizada
                </label>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-full h-12 rounded border border-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código Hex
                </label>
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="#FF6B9D"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={aplicarCor}
                  className="flex-1 bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
                >
                  Aplicar
                </button>
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QRCodeGenerator
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        url={gerarLinkCatalogo()}
        title={branding.nome_confeitaria}
      />
    </div>
  )
}