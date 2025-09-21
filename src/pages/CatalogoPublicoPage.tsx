import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingBag, MessageCircle, Phone, Heart, Star } from 'lucide-react'
import { ProdutoCatalogo } from '../types'
import { getFromLocalStorage } from '../utils/localStorage'

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

export default function CatalogoPublicoPage() {
  const { userId } = useParams<{ userId: string }>()
  const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([])
  const [branding, setBranding] = useState<CatalogoBranding | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      // Carregar produtos do usuário
      const allProdutos = getFromLocalStorage<ProdutoCatalogo[]>('catalogo_produtos', [])
      const userProdutos = allProdutos.filter((p: any) => p.usuario_id === userId && p.ativo)
      setProdutos(userProdutos)

      // Carregar configurações de branding
      const allBranding = getFromLocalStorage<CatalogoBranding[]>('catalogo_branding', [])
      const userBranding = allBranding.find(b => b.usuario_id === userId)
      setBranding(userBranding || null)

      setLoading(false)
    }
  }, [userId])

  const formatarWhatsApp = (numero: string) => {
    const numerosApenas = numero.replace(/\D/g, '')
    if (numerosApenas.length === 11) {
      return `https://wa.me/55${numerosApenas}`
    }
    return `https://wa.me/${numerosApenas}`
  }

  const entrarEmContato = (produto?: ProdutoCatalogo) => {
    if (!branding?.configuracoes.contato_whatsapp) return
    
    let mensagem = `Olá! Gostaria de saber mais sobre os produtos da ${branding.nome_confeitaria}.`
    
    if (produto) {
      mensagem = `Olá! Tenho interesse no produto: *${produto.nome}*. Gostaria de saber mais informações!`
    }
    
    const whatsappUrl = formatarWhatsApp(branding.configuracoes.contato_whatsapp)
    window.open(`${whatsappUrl}?text=${encodeURIComponent(mensagem)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando catálogo...</p>
        </div>
      </div>
    )
  }

  if (!branding) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Catálogo não encontrado</h2>
          <p className="text-gray-600">Este catálogo pode ter sido removido ou não existe.</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: branding.cor_secundaria,
        fontFamily: branding.fonte === 'serif' ? 'serif' : branding.fonte === 'mono' ? 'monospace' : 'sans-serif'
      }}
    >
      {/* Header do Catálogo */}
      <div className="bg-white shadow-sm border-b-2" style={{ borderBottomColor: branding.cor_primaria }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            {/* Logo */}
            {branding.logo_url && (
              <div className="mb-6 flex justify-center">
                <img 
                  src={branding.logo_url} 
                  alt={branding.nome_confeitaria}
                  className="w-24 h-24 object-cover rounded-full shadow-lg border-4"
                  style={{ borderColor: branding.cor_primaria }}
                />
              </div>
            )}
            
            {/* Nome da Confeitaria */}
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ color: branding.cor_primaria }}
            >
              {branding.nome_confeitaria}
            </h1>
            
            {/* Texto do Cabeçalho */}
            <p className="text-lg text-gray-600 mb-6">
              {branding.configuracoes.texto_cabecalho}
            </p>
            
            {/* Botão de Contato */}
            {branding.configuracoes.contato_whatsapp && (
              <button
                onClick={() => entrarEmContato()}
                className="inline-flex items-center space-x-2 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{ backgroundColor: branding.cor_primaria }}
              >
                <MessageCircle className="h-5 w-5" />
                <span>Fale Conosco no WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {produtos.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum produto disponível
            </h3>
            <p className="text-gray-500">
              Os produtos serão exibidos aqui quando forem adicionados ao catálogo.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Nossos Produtos</h2>
              {branding.elementos_visuais.separadores && (
                <div 
                  className="w-24 h-1 mx-auto rounded-full"
                  style={{ backgroundColor: branding.cor_primaria }}
                ></div>
              )}
            </div>
            
            <div className={`grid gap-6 ${
              branding.layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
              branding.layout === 'lista' ? 'grid-cols-1 max-w-2xl mx-auto' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
              {produtos.map((produto) => (
                <div 
                  key={produto.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                    branding.elementos_visuais.bordas_decorativas ? 'border-2' : 'border'
                  }`}
                  style={{ 
                    borderColor: branding.elementos_visuais.bordas_decorativas ? branding.cor_primaria : '#e5e7eb' 
                  }}
                >
                  {/* Imagem do Produto */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {produto.foto ? (
                      <img 
                        src={produto.foto} 
                        alt={produto.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Informações do Produto */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">
                        {produto.nome}
                      </h3>
                      {branding.elementos_visuais.icones_tematicos && (
                        <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                      )}
                    </div>
                    
                    {produto.categoria && (
                      <p className="text-sm text-gray-500 mb-2">
                        {produto.categoria} • {produto.serve}
                      </p>
                    )}
                    
                    {branding.configuracoes.mostrar_descricoes && produto.descricao_publica && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {produto.descricao_publica}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      {branding.configuracoes.mostrar_precos && (
                        <div className="text-xl font-bold" style={{ color: branding.cor_primaria }}>
                          R$ {produto.preco_publico.toFixed(2)}
                        </div>
                      )}
                      
                      <button
                        onClick={() => entrarEmContato(produto)}
                        className="flex items-center space-x-1 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: branding.cor_primaria }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Pedir</span>
                      </button>
                    </div>
                    
                    {produto.prazo_entrega && (
                      <p className="text-xs text-gray-500 mt-2">
                        📅 Prazo: {produto.prazo_entrega}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-6 mb-4">
            {branding.logo_url && (
              <img 
                src={branding.logo_url} 
                alt={branding.nome_confeitaria}
                className="w-8 h-8 object-cover rounded"
              />
            )}
            <h3 className="text-lg font-semibold" style={{ color: branding.cor_primaria }}>
              {branding.nome_confeitaria}
            </h3>
          </div>
          
          {branding.configuracoes.contato_whatsapp && (
            <p className="text-gray-600 text-sm">
              Entre em contato: {branding.configuracoes.contato_whatsapp}
            </p>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Catálogo criado com DoceCalc 💜
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}