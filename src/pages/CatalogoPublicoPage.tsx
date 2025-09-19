import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageCircle, MapPin, Instagram, Clock, ShoppingBag, ArrowLeft } from 'lucide-react'
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import { ProdutoCatalogo, DadosConfeitaria, User } from '../types'

interface FormularioEncomenda {
  nome: string
  whatsapp: string
  dataDesejada: string
  observacoes: string
}

export default function CatalogoPublicoPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([])
  const [dadosConfeitaria, setDadosConfeitaria] = useState<DadosConfeitaria | null>(null)
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoCatalogo | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formulario, setFormulario] = useState<FormularioEncomenda>({
    nome: '',
    whatsapp: '',
    dataDesejada: '',
    observacoes: ''
  })
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (userId) {
      // Carrega dados do localStorage
      const produtosData = getFromLocalStorage<ProdutoCatalogo[]>(`produtos_catalogo_${userId}`, [])
      const confeitariaData = getFromLocalStorage<DadosConfeitaria | null>(`dados_confeitaria_${userId}`, null)
      const userData = getFromLocalStorage<User | null>(`user_${userId}`, null)
      
      // Verifica se o catálogo está ativo
      if (!userData?.catalogo_ativo) {
        navigate('/')
        return
      }
      
      setProdutos(produtosData.filter(p => p.ativo))
      setDadosConfeitaria(confeitariaData)
    }
  }, [userId, navigate])

  const abrirModalEncomenda = (produto: ProdutoCatalogo) => {
    setProdutoSelecionado(produto)
    setShowModal(true)
    setFormulario({
      nome: '',
      whatsapp: '',
      dataDesejada: '',
      observacoes: ''
    })
  }

  const fecharModal = () => {
    setShowModal(false)
    setProdutoSelecionado(null)
  }

  const enviarEncomenda = async () => {
    if (!produtoSelecionado || !userId) return
    
    // Validações básicas
    if (!formulario.nome.trim()) {
      alert('Por favor, informe seu nome')
      return
    }
    
    if (!formulario.whatsapp.trim()) {
      alert('Por favor, informe seu WhatsApp')
      return
    }
    
    if (!formulario.dataDesejada) {
      alert('Por favor, informe a data desejada')
      return
    }

    setEnviando(true)
    
    try {
      // Cria nova encomenda
      const novaEncomenda = {
        id: `encomenda_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        produto_id: produtoSelecionado.id,
        cliente_nome: formulario.nome.trim(),
        cliente_whatsapp: formulario.whatsapp.trim(),
        data_desejada: formulario.dataDesejada,
        observacoes: formulario.observacoes.trim(),
        status: 'nova' as const,
        data_encomenda: new Date().toISOString(),
        confeitaria_id: userId,
        valor_total: produtoSelecionado.preco_publico
      }
      
      // Salva no localStorage da confeitaria
      const encomendas = getFromLocalStorage<any[]>(`encomendas_${userId}`, [])
      encomendas.push(novaEncomenda)
      saveToLocalStorage(`encomendas_${userId}`, encomendas)
      
      // Cria mensagem para WhatsApp
      const mensagemWhatsApp = `🍰 *Nova Encomenda - ${dadosConfeitaria?.nomeFantasia}*\n\n` +
        `📦 *Produto:* ${produtoSelecionado.nome}\n` +
        `👤 *Cliente:* ${formulario.nome}\n` +
        `📱 *WhatsApp:* ${formulario.whatsapp}\n` +
        `📅 *Data desejada:* ${new Date(formulario.dataDesejada).toLocaleDateString('pt-BR')}\n` +
        `💰 *Valor:* R$ ${produtoSelecionado.preco_publico.toFixed(2)}\n` +
        `📝 *Observações:* ${formulario.observacoes || 'Nenhuma'}\n\n` +
        `Encomenda realizada através do catálogo online.`
      
      // Mostra confirmação
      alert(`✅ Encomenda enviada com sucesso!\n\nVocê receberá a confirmação em breve.`)
      
      // Opcional: Abrir WhatsApp da confeitaria se disponível
      if (dadosConfeitaria?.whatsapp) {
        const whatsappUrl = `https://wa.me/${dadosConfeitaria.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensagemWhatsApp)}`
        window.open(whatsappUrl, '_blank')
      }
      
      fecharModal()
      
    } catch (error) {
      console.error('Erro ao enviar encomenda:', error)
      alert('Erro ao enviar encomenda. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  const formatarWhatsApp = (whatsapp: string) => {
    return whatsapp.replace(/\D/g, '')
  }

  if (!dadosConfeitaria) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Catálogo não encontrado</h1>
          <p className="text-gray-600 mb-4">Este catálogo não existe ou não está disponível.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{dadosConfeitaria.nomeFantasia}</h1>
              {dadosConfeitaria.descricao && (
                <p className="text-gray-600 text-sm mt-1">{dadosConfeitaria.descricao}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {dadosConfeitaria.whatsapp && (
                <a
                  href={`https://wa.me/${formatarWhatsApp(dadosConfeitaria.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              )}
              
              {dadosConfeitaria.instagram && (
                <a
                  href={`https://instagram.com/${dadosConfeitaria.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>
              )}
            </div>
          </div>
          
          {dadosConfeitaria.endereco && (
            <div className="flex items-center space-x-2 text-gray-600 text-sm mt-2">
              <MapPin className="h-4 w-4" />
              <span>{dadosConfeitaria.endereco}</span>
            </div>
          )}
        </div>
      </header>

      {/* Produtos */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {produtos.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto disponível</h2>
            <p className="text-gray-600">Produtos em breve! Volte mais tarde.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div key={produto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Placeholder para foto */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">🧁</span>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{produto.nome}</h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {produto.descricao_publica}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{produto.prazo_entrega}</span>
                    </div>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {produto.serve}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        R$ {produto.preco_publico.toFixed(2)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => abrirModalEncomenda(produto)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Encomendar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Encomenda */}
      {showModal && produtoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Fazer Encomenda</h3>
                <button
                  onClick={fecharModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{produtoSelecionado.nome}</h4>
                <p className="text-sm text-gray-600 mt-1">{produtoSelecionado.descricao_publica}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-gray-900">
                    R$ {produtoSelecionado.preco_publico.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Entrega: {produtoSelecionado.prazo_entrega}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seu nome *
                  </label>
                  <input
                    type="text"
                    value={formulario.nome}
                    onChange={(e) => setFormulario({...formulario, nome: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Como devemos te chamar?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formulario.whatsapp}
                    onChange={(e) => setFormulario({...formulario, whatsapp: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data desejada *
                  </label>
                  <input
                    type="date"
                    value={formulario.dataDesejada}
                    onChange={(e) => setFormulario({...formulario, dataDesejada: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={formulario.observacoes}
                    onChange={(e) => setFormulario({...formulario, observacoes: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Personalizações, sabores, decoração..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={fecharModal}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarEncomenda}
                  disabled={enviando}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {enviando ? 'Enviando...' : 'Enviar Pedido'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}