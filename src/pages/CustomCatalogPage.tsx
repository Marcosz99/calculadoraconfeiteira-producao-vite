import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Palette, Image, Type, Save, Eye, Share2, Download, Star } from 'lucide-react'

interface CatalogSettings {
  businessName: string
  logo: string | null
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fonts: {
    heading: string
    body: string
  }
  layout: 'grid' | 'list' | 'magazine'
  showPrices: boolean
  showDescriptions: boolean
  watermark: boolean
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
  const [settings, setSettings] = useState<CatalogSettings>({
    businessName: 'Minha Confeitaria',
    logo: null,
    colors: {
      primary: '#f97316',
      secondary: '#fed7aa', 
      accent: '#ea580c'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    layout: 'grid',
    showPrices: true,
    showDescriptions: true,
    watermark: true
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

  const handleColorChange = (colorType: keyof CatalogSettings['colors'], value: string) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }))
  }

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configurações */}
          <div className="lg:col-span-1 space-y-6">
            {/* Identidade Visual */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Palette className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold">Identidade Visual</h2>
              </div>

              <div className="space-y-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Clique para adicionar logo</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cores
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <label className="text-sm text-gray-600 w-20">Primária:</label>
                      <input
                        type="color"
                        value={settings.colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-12 h-8 rounded border border-gray-300"
                      />
                      <span className="text-sm text-gray-600">{settings.colors.primary}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label className="text-sm text-gray-600 w-20">Secundária:</label>
                      <input
                        type="color"
                        value={settings.colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="w-12 h-8 rounded border border-gray-300"
                      />
                      <span className="text-sm text-gray-600">{settings.colors.secondary}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label className="text-sm text-gray-600 w-20">Destaque:</label>
                      <input
                        type="color"
                        value={settings.colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-12 h-8 rounded border border-gray-300"
                      />
                      <span className="text-sm text-gray-600">{settings.colors.accent}</span>
                    </div>
                  </div>
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
        </div>
      </div>
    </div>
  )
}