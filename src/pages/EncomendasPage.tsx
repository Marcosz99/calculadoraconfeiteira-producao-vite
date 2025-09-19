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

        </div>

        {/* Em Breve */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Gestão de Encomendas</h2>
            <p className="text-xl text-gray-600 mb-2">Em breve!</p>
            <p className="text-gray-500 max-w-md mx-auto">
              Estamos desenvolvendo um sistema completo para gerenciar todas as suas encomendas de forma organizada e eficiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}