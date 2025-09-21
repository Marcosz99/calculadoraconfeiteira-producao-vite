import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Palette, Image, Type, Save, Eye, Share2, Download, Star, Sparkles, Frame, Heart, Coffee } from 'lucide-react'

interface CatalogSettings {
  businessName: string
  logo: string | null
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  layout: 'grid' | 'list' | 'magazine'
  showPrices: boolean
  showDescriptions: boolean
  watermark: boolean
  // FASE 8.1: Novos elementos visuais
  decorativeBorders: boolean
  backgroundPattern: 'none' | 'dots' | 'hearts' | 'sparkles'
  iconTheme: 'minimal' | 'cute' | 'elegant'
  customSeparators: boolean
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
}

export default function CustomCatalogPage() {
  // FASE 8.1: Paletas sugeridas
  const colorPalettes = [
    { name: 'Chocolate', colors: { primary: '#8b4513', secondary: '#deb887', accent: '#d2691e', background: '#fdf6e3', text: '#3d2914' } },
    { name: 'Morango', colors: { primary: '#ff69b4', secondary: '#ffb6c1', accent: '#ff1493', background: '#fff0f5', text: '#8b0a1a' } },
    { name: 'Baunilha', colors: { primary: '#daa520', secondary: '#f5deb3', accent: '#ffd700', background: '#fffaf0', text: '#8b4513' } },
    { name: 'Menta', colors: { primary: '#00fa9a', secondary: '#afeeee', accent: '#20b2aa', background: '#f0ffff', text: '#006400' } },
    { name: 'Café', colors: { primary: '#6f4e37', secondary: '#ddbf94', accent: '#8b4513', background: '#fdf5e6', text: '#3e2723' } },
    { name: 'Rosa', colors: { primary: '#ff69b4', secondary: '#ffc0cb', accent: '#ff1493', background: '#fff0f5', text: '#8b0000' } }
  ]

  // FASE 8.1: Fontes expandidas
  const fontOptions = [
    { name: 'Elegante', value: 'Playfair Display, serif', category: 'serif' },
    { name: 'Moderna', value: 'Inter, sans-serif', category: 'sans-serif' },
    { name: 'Divertida', value: 'Nunito, sans-serif', category: 'rounded' },
    { name: 'Clássica', value: 'Times New Roman, serif', category: 'times' },
    { name: 'Artesanal', value: 'Dancing Script, cursive', category: 'handwritten' },
    { name: 'Clean', value: 'Roboto, sans-serif', category: 'minimal' }
  ]

  const [settings, setSettings] = useState<CatalogSettings>({
    businessName: 'Minha Confeitaria',
    logo: null,
    colors: {
      primary: '#f97316',
      secondary: '#fed7aa', 
      accent: '#ea580c',
      background: '#ffffff',
      text: '#1f2937'
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Inter, sans-serif'
    },
    layout: 'grid',
    showPrices: true,
    showDescriptions: true,
    watermark: true,
    // FASE 8.1: Novos elementos visuais
    decorativeBorders: false,
    backgroundPattern: 'none',
    iconTheme: 'minimal',
    customSeparators: false
  })

  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Brigadeiro Gourmet',
      description: 'Delicioso brigadeiro artesanal feito com chocolate belga',
      price: 3.50,
      image: '/placeholder-product-1.jpg',
      category: 'Docinhos',
      featured: true
    },
    {
      id: '2', 
      name: 'Bolo de Chocolate',
      description: 'Bolo úmido de chocolate com cobertura cremosa',
      price: 45.00,
      image: '/placeholder-product-2.jpg',
      category: 'Bolos',
      featured: false
    },
    {
      id: '3',
      name: 'Torta de Limão',
      description: 'Torta refrescante com base crocante e creme de limão',
      price: 35.00,
      image: '/placeholder-product-3.jpg',
      category: 'Tortas',
      featured: true
    }
  ])

  const [previewMode, setPreviewMode] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [activeColorType, setActiveColorType] = useState<keyof CatalogSettings['colors']>('primary')
  // FASE 8.2: Sistema de abas
  const [activeTab, setActiveTab] = useState<'personalization' | 'products'>('personalization')
  // FASE 8.2: Gerenciamento de produtos do catálogo
  const [catalogProducts, setCatalogProducts] = useState<Record<string, {
    enabled: boolean
    catalogPhoto: string
    publicDescription: string
    publicPrice: number
    availability: 'always' | 'on_demand'
  }>>({})

  const handleColorChange = (colorType: keyof CatalogSettings['colors'], value: string) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }))
  }

  // FASE 8.1: Aplicar paleta sugerida
  const applyColorPalette = (palette: typeof colorPalettes[0]) => {
    setSettings(prev => ({
      ...prev,
      colors: palette.colors
    }))
  }

  // FASE 8.1: Atualizar fonte
  const updateFont = (fontType: 'heading' | 'body', fontValue: string) => {
    setSettings(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontType]: fontValue
      }
    }))
  }

  // FASE 8.1: Patterns de fundo
  const getBackgroundPattern = () => {
    const patterns = {
      none: '',
      dots: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
      hearts: 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M10 18s8-5.5 8-10a4 4 0 0 0-8 0 4 4 0 0 0-8 0c0 4.5 8 10 8 10z" fill="%23ff69b430"%3E%3C/svg%3E")',
      sparkles: 'url("data:image/svg+xml,%3Csvg width="30" height="30" xmlns="http://www.w3.org/2000/svg"%3E%3Cpolygon points="15,2 18,12 28,15 18,18 15,28 12,18 2,15 12,12" fill="%23ffd70030"%3E%3C/svg%3E")'
    }
    return patterns[settings.backgroundPattern]
  }

  // FASE 8.2: Funcoes do catalogo
  const updateCatalogProduct = (recipeId: string, updates: Partial<typeof catalogProducts[string]>) => {
    setCatalogProducts(prev => ({
      ...prev,
      [recipeId]: {
        enabled: prev[recipeId]?.enabled || false,
        catalogPhoto: prev[recipeId]?.catalogPhoto || '',
        publicDescription: prev[recipeId]?.publicDescription || '',
        publicPrice: prev[recipeId]?.publicPrice || 0,
        availability: prev[recipeId]?.availability || 'always',
        ...updates
      }
    }))
  }

  const generateCatalogLink = () => {
    const catalogId = Math.random().toString(36).substring(7)
    const link = `${window.location.origin}/catalogo-publico/${catalogId}`
    navigator.clipboard.writeText(link)
    alert(`🔗 Link do catálogo copiado!\n\n${link}\n\nCompartilhe este link com seus clientes para que vejam seus produtos.`)
  }

  // FASE 8.2: Mock de receitas do usuário (em produção viria do localStorage)
  const userRecipes = [
    { id: '1', nome: 'Brigadeiro Gourmet', categoria: 'Docinhos', preco_sugerido: 3.50, tempo_preparo_mins: 30 },
    { id: '2', nome: 'Bolo de Chocolate', categoria: 'Bolos', preco_sugerido: 45.00, tempo_preparo_mins: 120 },
    { id: '3', nome: 'Torta de Limão', categoria: 'Tortas', preco_sugerido: 35.00, tempo_preparo_mins: 90 },
    { id: '4', nome: 'Cupcake Red Velvet', categoria: 'Bolos', preco_sugerido: 8.50, tempo_preparo_mins: 45 },
    { id: '5', nome: 'Macarons', categoria: 'Docinhos', preco_sugerido: 12.00, tempo_preparo_mins: 180 }
  ]

  const generatePublicLink = () => {
    const catalogId = Math.random().toString(36).substring(7)
    const link = `${window.location.origin}/catalog/${catalogId}`
    navigator.clipboard.writeText(link)
    alert(`Link copiado para clipboard: ${link}`)
  }

  const exportPDF = () => {
    // Simular export para PDF
    alert('Catálogo exportado para PDF! (Funcionalidade mock)')
  }

  if (previewMode) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: settings.colors.secondary }}>
        {/* Header do catálogo */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {settings.logo && (
                  <img src={settings.logo} alt="Logo" className="h-12 w-12 rounded-full" />
                )}
                <h1 
                  className="text-3xl font-bold"
                  style={{ 
                    color: settings.colors.primary,
                    fontFamily: settings.fonts.heading 
                  }}
                >
                  {settings.businessName}
                </h1>
              </div>
              <button
                onClick={() => setPreviewMode(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Sair da Visualização
              </button>
            </div>
          </div>
        </div>

        {/* Produtos */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 
            className="text-2xl font-semibold mb-6"
            style={{ 
              color: settings.colors.primary,
              fontFamily: settings.fonts.heading 
            }}
          >
            Nossos Produtos
          </h2>

          <div className={`grid gap-6 ${
            settings.layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            settings.layout === 'list' ? 'grid-cols-1' :
            'grid-cols-1 md:grid-cols-2'
          }`}>
            {products.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Imagem do produto</span>
                  </div>
                  {product.featured && (
                    <div 
                      className="absolute top-2 right-2 px-2 py-1 rounded-full text-white text-xs font-semibold"
                      style={{ backgroundColor: settings.colors.accent }}
                    >
                      <Star className="h-3 w-3 inline mr-1" />
                      Destaque
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 
                    className="font-semibold text-lg mb-2"
                    style={{ 
                      color: settings.colors.primary,
                      fontFamily: settings.fonts.heading 
                    }}
                  >
                    {product.name}
                  </h3>
                  
                  {settings.showDescriptions && (
                    <p 
                      className="text-gray-600 text-sm mb-3"
                      style={{ fontFamily: settings.fonts.body }}
                    >
                      {product.description}
                    </p>
                  )}
                  
                  {settings.showPrices && (
                    <div 
                      className="text-xl font-bold"
                      style={{ color: settings.colors.accent }}
                    >
                      R$ {product.price.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Watermark */}
          {settings.watermark && (
            <div className="text-center mt-8 text-gray-400 text-sm">
              Criado com DoceCalc Pro
            </div>
          )}
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-gray-900">Catálogo Personalizado</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewMode(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </button>
              <button
                onClick={generatePublicLink}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </button>
              <button
                onClick={exportPDF}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* FASE 8.2: Sistema de Abas */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('personalization')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'personalization'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎨 Personalização
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🍰 Produtos do Catálogo
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'personalization' ? (
          // ABA PERSONALIZAÇÃO
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Configurações */}
            <div className="lg:col-span-1 space-y-6">
            {/* FASE 8.1: Identidade Visual Avançada */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Palette className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold">🎨 Identidade Visual</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Negócio
                  </label>
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => setSettings(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* FASE 8.1: Paletas Sugeridas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🎨 Paletas Sugeridas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorPalettes.map((palette) => (
                      <button
                        key={palette.name}
                        onClick={() => applyColorPalette(palette)}
                        className="p-3 border rounded-lg hover:border-orange-500 transition-colors"
                      >
                        <div className="flex space-x-1 mb-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: palette.colors.primary }}></div>
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: palette.colors.secondary }}></div>
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: palette.colors.accent }}></div>
                        </div>
                        <span className="text-xs text-gray-600">{palette.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* FASE 8.1: Color Picker Avançado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🌈 Cores Personalizadas
                  </label>
                  <div className="space-y-3">
                    {(['primary', 'secondary', 'accent', 'background', 'text'] as const).map((colorType) => (
                      <div key={colorType} className="flex items-center space-x-3">
                        <label className="text-sm text-gray-600 w-24 capitalize">
                          {colorType === 'primary' ? 'Primária' : 
                           colorType === 'secondary' ? 'Secundária' :
                           colorType === 'accent' ? 'Destaque' :
                           colorType === 'background' ? 'Fundo' : 'Texto'}:
                        </label>
                        <input
                          type="color"
                          value={settings.colors[colorType]}
                          onChange={(e) => handleColorChange(colorType, e.target.value)}
                          className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 font-mono">{settings.colors[colorType]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FASE 8.1: Upload de Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📷 Logo da Confeitaria
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 cursor-pointer transition-colors">
                    <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Clique para adicionar sua logo</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG até 2MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FASE 8.1: Tipografia Expandida */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Type className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold">✍️ Tipografia</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fonte para Títulos
                  </label>
                  <select
                    value={settings.fonts.heading}
                    onChange={(e) => updateFont('heading', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name} ({font.category})
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 p-2 bg-gray-50 rounded" style={{ fontFamily: settings.fonts.heading }}>
                    <span className="text-lg font-bold">Exemplo de Título</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fonte para Textos
                  </label>
                  <select
                    value={settings.fonts.body}
                    onChange={(e) => updateFont('body', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name} ({font.category})
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 p-2 bg-gray-50 rounded" style={{ fontFamily: settings.fonts.body }}>
                    <span>Exemplo de texto descritivo para produtos.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FASE 8.1: Elementos Visuais Decorativos */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold">✨ Elementos Decorativos</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Padrão de Fundo
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'none', label: 'Nenhum', icon: '⚪' },
                      { value: 'dots', label: 'Pontos', icon: '⚫' },
                      { value: 'hearts', label: 'Corações', icon: '💕' },
                      { value: 'sparkles', label: 'Estrelas', icon: '✨' }
                    ].map((pattern) => (
                      <button
                        key={pattern.value}
                        onClick={() => setSettings(prev => ({ ...prev, backgroundPattern: pattern.value as any }))}
                        className={`p-3 border rounded-lg text-sm transition-colors ${
                          settings.backgroundPattern === pattern.value 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-300 hover:border-orange-300'
                        }`}
                      >
                        <span className="text-lg mb-1 block">{pattern.icon}</span>
                        {pattern.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tema de Ícones
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'minimal', label: 'Minimal', icon: '○' },
                      { value: 'cute', label: 'Fofinho', icon: '🧁' },
                      { value: 'elegant', label: 'Elegante', icon: '👑' }
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => setSettings(prev => ({ ...prev, iconTheme: theme.value as any }))}
                        className={`p-3 border rounded-lg text-sm transition-colors ${
                          settings.iconTheme === theme.value 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-300 hover:border-orange-300'
                        }`}
                      >
                        <span className="text-lg mb-1 block">{theme.icon}</span>
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.decorativeBorders}
                      onChange={(e) => setSettings(prev => ({ ...prev, decorativeBorders: e.target.checked }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">🖼️ Bordas Decorativas</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.customSeparators}
                      onChange={(e) => setSettings(prev => ({ ...prev, customSeparators: e.target.checked }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">➖ Separadores Personalizados</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Layout e Configurações */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Type className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold">Layout</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estilo de Layout
                  </label>
                  <select
                    value={settings.layout}
                    onChange={(e) => setSettings(prev => ({ ...prev, layout: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="grid">Grade</option>
                    <option value="list">Lista</option>
                    <option value="magazine">Revista</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.showPrices}
                      onChange={(e) => setSettings(prev => ({ ...prev, showPrices: e.target.checked }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mostrar preços</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.showDescriptions}
                      onChange={(e) => setSettings(prev => ({ ...prev, showDescriptions: e.target.checked }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mostrar descrições</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.watermark}
                      onChange={(e) => setSettings(prev => ({ ...prev, watermark: e.target.checked }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Marca d'água DoceCalc</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Pré-visualização</h2>
              
              <div 
                className="border border-gray-200 rounded-lg overflow-hidden"
                style={{ backgroundColor: settings.colors.secondary }}
              >
                {/* Header simulado */}
                <div className="bg-white p-4 border-b">
                  <h3 
                    className="text-xl font-bold"
                    style={{ 
                      color: settings.colors.primary,
                      fontFamily: settings.fonts.heading 
                    }}
                  >
                    {settings.businessName}
                  </h3>
                </div>

                {/* Produtos simulados */}
                <div className="p-4">
                  <h4 
                    className="text-lg font-semibold mb-3"
                    style={{ 
                      color: settings.colors.primary,
                      fontFamily: settings.fonts.heading 
                    }}
                  >
                    Nossos Produtos
                  </h4>

                  <div className={`grid gap-3 ${
                    settings.layout === 'grid' ? 'grid-cols-2' :
                    settings.layout === 'list' ? 'grid-cols-1' :
                    'grid-cols-1'
                  }`}>
                    {products.slice(0, 2).map(product => (
                      <div key={product.id} className="bg-white rounded p-3 shadow-sm">
                        <div className="h-16 bg-gray-200 rounded mb-2"></div>
                        <h5 
                          className="font-semibold text-sm"
                          style={{ color: settings.colors.primary }}
                        >
                          {product.name}
                        </h5>
                        {settings.showDescriptions && (
                          <p className="text-xs text-gray-600 mt-1">{product.description.substring(0, 40)}...</p>
                        )}
                        {settings.showPrices && (
                          <div 
                            className="text-sm font-bold mt-1"
                            style={{ color: settings.colors.accent }}
                          >
                            R$ {product.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {settings.watermark && (
                    <div className="text-center mt-4 text-gray-400 text-xs">
                      Criado com DoceCalc Pro
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // FASE 8.2: ABA PRODUTOS DO CATÁLOGO
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">🍰 Produtos do Catálogo</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Configure quais receitas aparecerão no seu catálogo público
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={generateCatalogLink}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Gerar Link
                  </button>
                  <button
                    onClick={() => {
                      const qrData = `${window.location.origin}/catalogo-publico/${Math.random().toString(36).substring(7)}`
                      alert(`QR Code gerado para:\\n\\n${qrData}\\n\\n(Em produção seria mostrado um QR Code visual)`)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    📱 QR Code
                  </button>
                </div>
              </div>

              {/* Lista de Receitas para Catálogo */}
              <div className="space-y-4">
                {userRecipes.map((recipe) => (
                  <div key={recipe.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      {/* Toggle ON/OFF */}
                      <label className="flex items-center mt-1">
                        <input
                          type="checkbox"
                          checked={catalogProducts[recipe.id]?.enabled || false}
                          onChange={(e) => updateCatalogProduct(recipe.id, { enabled: e.target.checked })}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Ativo no catálogo</span>
                      </label>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg text-gray-900">{recipe.nome}</h3>
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs rounded-full">
                            {recipe.categoria}
                          </span>
                        </div>

                        {catalogProducts[recipe.id]?.enabled && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            {/* Foto do Produto Final */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                📷 Foto do Produto Final
                              </label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Adicionar foto</p>
                              </div>
                            </div>

                            {/* Preço Público */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                💰 Preço Público
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={catalogProducts[recipe.id]?.publicPrice || recipe.preco_sugerido}
                                onChange={(e) => updateCatalogProduct(recipe.id, { publicPrice: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                placeholder="R$ 0,00"
                              />
                              {recipe.preco_sugerido && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Preço sugerido: R$ {recipe.preco_sugerido.toFixed(2)}
                                </p>
                              )}
                            </div>

                            {/* Descrição para Clientes */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                📝 Descrição para Clientes
                              </label>
                              <textarea
                                value={catalogProducts[recipe.id]?.publicDescription || ''}
                                onChange={(e) => updateCatalogProduct(recipe.id, { publicDescription: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                placeholder="Descreva seu produto de forma atrativa para os clientes..."
                              />
                            </div>

                            {/* Disponibilidade */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                ⏰ Disponibilidade
                              </label>
                              <div className="flex space-x-4">
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name={`availability-${recipe.id}`}
                                    checked={(catalogProducts[recipe.id]?.availability || 'always') === 'always'}
                                    onChange={() => updateCatalogProduct(recipe.id, { availability: 'always' })}
                                    className="text-orange-600 focus:ring-orange-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">✅ Sempre disponível</span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name={`availability-${recipe.id}`}
                                    checked={(catalogProducts[recipe.id]?.availability || 'always') === 'on_demand'}
                                    onChange={() => updateCatalogProduct(recipe.id, { availability: 'on_demand' })}
                                    className="text-orange-600 focus:ring-orange-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">📋 Sob encomenda</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {userRecipes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Coffee className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma receita encontrada.</p>
                    <p className="text-sm mt-1">Crie receitas primeiro para adicioná-las ao catálogo.</p>
                  </div>
                )}
              </div>

              {/* Preview do Catálogo Público */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">👁️ Preview do Catálogo Público</h3>
                
                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-center border-b pb-4 mb-4">
                      <h2 
                        className="text-2xl font-bold"
                        style={{ 
                          color: settings.colors.primary,
                          fontFamily: settings.fonts.heading 
                        }}
                      >
                        {settings.businessName}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">Catálogo de Produtos</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userRecipes
                        .filter(recipe => catalogProducts[recipe.id]?.enabled)
                        .slice(0, 4)
                        .map(recipe => (
                        <div key={recipe.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                            <Image className="h-6 w-6 text-gray-400" />
                          </div>
                          <h4 className="font-semibold text-sm" style={{ color: settings.colors.primary }}>
                            {recipe.nome}
                          </h4>
                          {catalogProducts[recipe.id]?.publicDescription && (
                            <p className="text-xs text-gray-600 mt-1">
                              {catalogProducts[recipe.id].publicDescription.substring(0, 50)}...
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span 
                              className="font-bold text-sm"
                              style={{ color: settings.colors.accent }}
                            >
                              R$ {(catalogProducts[recipe.id]?.publicPrice || recipe.preco_sugerido || 0).toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {catalogProducts[recipe.id]?.availability === 'on_demand' ? '📋 Sob encomenda' : '✅ Disponível'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {userRecipes.filter(recipe => catalogProducts[recipe.id]?.enabled).length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <p>Ative produtos acima para vê-los no catálogo</p>
                      </div>
                    )}

                    <div className="text-center mt-6 pt-4 border-t">
                      <p className="text-xs text-gray-400">
                        💬 Faça seu pedido pelo WhatsApp ou telefone
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}