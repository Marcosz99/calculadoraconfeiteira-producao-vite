import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShoppingBag, ArrowLeft, Calendar, User, Phone, MessageSquare, CheckCircle, Clock, Package, Truck } from 'lucide-react'
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import { Encomenda, ProdutoCatalogo } from '../types'

export default function EncomendasPage() {
  const { user } = useAuth()
  const [encomendas, setEncomendas] = useState<Encomenda[]>([])
  const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([])
  const [filtroStatus, setFiltroStatus] = useState<string>('todas')

  useEffect(() => {
    if (user) {
      const encomendasData = getFromLocalStorage<Encomenda[]>(`encomendas_${user.id}`, [])
      const produtosData = getFromLocalStorage<ProdutoCatalogo[]>(`produtos_catalogo_${user.id}`, [])
      
      // Ordena por data mais recente
      const encomendasOrdenadas = encomendasData.sort((a, b) => 
        new Date(b.data_encomenda).getTime() - new Date(a.data_encomenda).getTime()
      )
      
      setEncomendas(encomendasOrdenadas)
      setProdutos(produtosData)
    }
  }, [user])

  const atualizarStatusEncomenda = (encomendaId: string, novoStatus: Encomenda['status']) => {
    if (!user) return
    
    const encomendasAtualizadas = encomendas.map(e => 
      e.id === encomendaId ? { ...e, status: novoStatus } : e
    )
    
    setEncomendas(encomendasAtualizadas)
    saveToLocalStorage(`encomendas_${user.id}`, encomendasAtualizadas)
  }

  const getProdutoNome = (produtoId: string) => {
    const produto = produtos.find(p => p.id === produtoId)
    return produto?.nome || 'Produto não encontrado'
  }

  const getStatusIcon = (status: Encomenda['status']) => {
    switch (status) {
      case 'nova': return <Clock className="h-5 w-5 text-orange-500" />
      case 'confirmada': return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'producao': return <Package className="h-5 w-5 text-purple-500" />
      case 'entregue': return <Truck className="h-5 w-5 text-green-500" />
      case 'cancelada': return <span className="h-5 w-5 text-red-500">❌</span>
      default: return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: Encomenda['status']) => {
    switch (status) {
      case 'nova': return 'Nova'
      case 'confirmada': return 'Confirmada'
      case 'producao': return 'Em Produção'
      case 'entregue': return 'Entregue'
      case 'cancelada': return 'Cancelada'
      default: return status
    }
  }

  const getStatusColor = (status: Encomenda['status']) => {
    switch (status) {
      case 'nova': return 'bg-orange-100 text-orange-800'
      case 'confirmada': return 'bg-blue-100 text-blue-800'
      case 'producao': return 'bg-purple-100 text-purple-800'
      case 'entregue': return 'bg-green-100 text-green-800'
      case 'cancelada': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const encomendasFiltradas = filtroStatus === 'todas' 
    ? encomendas 
    : encomendas.filter(e => e.status === filtroStatus)

  const contarPorStatus = (status: Encomenda['status']) => {
    return encomendas.filter(e => e.status === status).length
  }

  const abrirWhatsApp = (encomenda: Encomenda) => {
    const produto = produtos.find(p => p.id === encomenda.produto_id)
    const whatsapp = encomenda.cliente_whatsapp.replace(/\D/g, '')
    
    const mensagem = `Olá ${encomenda.cliente_nome}! 👋\n\n` +
      `Sobre sua encomenda de *${produto?.nome}*:\n` +
      `📅 Data desejada: ${new Date(encomenda.data_desejada).toLocaleDateString('pt-BR')}\n` +
      `💰 Valor: R$ ${encomenda.valor_total?.toFixed(2) || '0,00'}\n\n` +
      `Como posso te ajudar?`
    
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
                <span>Encomendas</span>
              </h1>
              <p className="text-gray-600 mt-2">Gerencie as encomendas recebidas através do seu catálogo</p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{encomendas.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{contarPorStatus('nova')}</div>
              <div className="text-sm text-gray-600">Novas</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{contarPorStatus('confirmada')}</div>
              <div className="text-sm text-gray-600">Confirmadas</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{contarPorStatus('producao')}</div>
              <div className="text-sm text-gray-600">Produção</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{contarPorStatus('entregue')}</div>
              <div className="text-sm text-gray-600">Entregues</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroStatus('todas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'todas' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todas ({encomendas.length})
            </button>
            <button
              onClick={() => setFiltroStatus('nova')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'nova' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Novas ({contarPorStatus('nova')})
            </button>
            <button
              onClick={() => setFiltroStatus('confirmada')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'confirmada' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Confirmadas ({contarPorStatus('confirmada')})
            </button>
            <button
              onClick={() => setFiltroStatus('producao')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'producao' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Em Produção ({contarPorStatus('producao')})
            </button>
            <button
              onClick={() => setFiltroStatus('entregue')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'entregue' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Entregues ({contarPorStatus('entregue')})
            </button>
          </div>
        </div>

        {/* Lista de Encomendas */}
        {encomendasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {filtroStatus === 'todas' ? 'Nenhuma encomenda ainda' : `Nenhuma encomenda ${getStatusText(filtroStatus as Encomenda['status']).toLowerCase()}`}
            </h2>
            <p className="text-gray-600 mb-4">
              {filtroStatus === 'todas' 
                ? 'Quando clientes fizerem pedidos através do seu catálogo, eles aparecerão aqui.'
                : 'Altere o filtro para ver encomendas com outros status.'
              }
            </p>
            {filtroStatus === 'todas' && (
              <Link
                to="/meu-catalogo"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Configurar Catálogo</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {encomendasFiltradas.map((encomenda) => (
              <div key={encomenda.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {getStatusIcon(encomenda.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(encomenda.status)}`}>
                        {getStatusText(encomenda.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(encomenda.data_encomenda).toLocaleDateString('pt-BR')} às {new Date(encomenda.data_encomenda).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {getProdutoNome(encomenda.produto_id)}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span><strong>Cliente:</strong> {encomenda.cliente_nome}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span><strong>WhatsApp:</strong> {encomenda.cliente_whatsapp}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span><strong>Entrega:</strong> {new Date(encomenda.data_desejada).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    {encomenda.observacoes && (
                      <div className="mt-3 flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span className="text-sm"><strong>Observações:</strong> {encomenda.observacoes}</span>
                      </div>
                    )}
                    
                    {encomenda.valor_total && (
                      <div className="mt-3">
                        <span className="text-lg font-bold text-gray-900">
                          R$ {encomenda.valor_total.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col lg:flex-row gap-3">
                    {/* Ações por Status */}
                    {encomenda.status === 'nova' && (
                      <>
                        <button
                          onClick={() => atualizarStatusEncomenda(encomenda.id, 'confirmada')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => atualizarStatusEncomenda(encomenda.id, 'cancelada')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    
                    {encomenda.status === 'confirmada' && (
                      <button
                        onClick={() => atualizarStatusEncomenda(encomenda.id, 'producao')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Iniciar Produção
                      </button>
                    )}
                    
                    {encomenda.status === 'producao' && (
                      <button
                        onClick={() => atualizarStatusEncomenda(encomenda.id, 'entregue')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Marcar Entregue
                      </button>
                    )}
                    
                    {/* WhatsApp sempre disponível */}
                    <button
                      onClick={() => abrirWhatsApp(encomenda)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}