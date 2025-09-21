import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Search, FileText, Calendar, DollarSign, User, Edit, Trash2, Eye, Send, Check, X, Clock, QrCode, MessageCircle } from 'lucide-react'
import QRCode from 'qrcode'
import { useAuth } from '../contexts/AuthContext'
import { Orcamento, OrcamentoItem, Cliente, Receita } from '../types'
import { supabase } from '@/integrations/supabase/client'

export default function OrcamentosPage() {
  const { user } = useAuth()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('todos')
  const [showModal, setShowModal] = useState(false)
  const [editingOrcamento, setEditingOrcamento] = useState<Orcamento | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [currentOrcamento, setCurrentOrcamento] = useState<Orcamento | null>(null)
  const [formData, setFormData] = useState({
    cliente_id: '',
    cliente_nome_avulso: '',
    descricao: '',
    observacoes: '',
    data_validade: '',
    incluir_qr_code: true
  })
  const [itensOrcamento, setItensOrcamento] = useState<OrcamentoItem[]>([])

  useEffect(() => {
    if (user) {
      loadDataFromSupabase()
    }
  }, [user])

  const loadDataFromSupabase = async () => {
    if (!user) return
    
    try {
      // Carregar orçamentos
      const { data: orcamentosData, error: orcamentosError } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      // Carregar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true })
      
      // Carregar receitas
      const { data: receitasData, error: receitasError } = await supabase
        .from('receitas')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true })
      
      if (orcamentosError) throw orcamentosError
      if (clientesError) throw clientesError
      if (receitasError) throw receitasError
      
      setOrcamentos(orcamentosData || [])
      setClientes(clientesData || [])
      setReceitas(receitasData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const filteredOrcamentos = orcamentos.filter(orcamento => {
    const cliente = clientes.find(c => c.id === orcamento.cliente_id)
    const nomeCliente = cliente?.nome || orcamento.cliente_nome_avulso || 'Cliente não informado'
    const matchesSearch = orcamento.numero_orcamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orcamento.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFiltro === 'todos' || orcamento.status === statusFiltro
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rascunho': return 'text-gray-600 bg-gray-100'
      case 'enviado': return 'text-blue-600 bg-blue-100'
      case 'aprovado': return 'text-green-600 bg-green-100'
      case 'rejeitado': return 'text-red-600 bg-red-100'
      case 'expirado': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'rascunho': return <Edit className="h-4 w-4" />
      case 'enviado': return <Send className="h-4 w-4" />
      case 'aprovado': return <Check className="h-4 w-4" />
      case 'rejeitado': return <X className="h-4 w-4" />
      case 'expirado': return <Clock className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const calcularTotalOrcamento = (itens: OrcamentoItem[]) => {
    return itens.reduce((total, item) => total + item.valor_total, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || itensOrcamento.length === 0) return

    try {
      const valorTotal = calcularTotalOrcamento(itensOrcamento)
      const numeroOrcamento = editingOrcamento?.numero || 
        `ORC-${Date.now().toString().slice(-6)}`

      const orcamentoData = {
        user_id: user.id,
        cliente_id: formData.cliente_id || null,
        numero: numeroOrcamento,
        data_evento: formData.data_validade || null,
        status: 'rascunho',
        valor_total: valorTotal,
        valor_final: valorTotal,
        observacoes: formData.observacoes || null,
        itens: itensOrcamento
      }

      if (editingOrcamento) {
        // Atualizar orçamento existente
        const { data, error } = await supabase
          .from('orcamentos')
          .update(orcamentoData)
          .eq('id', editingOrcamento.id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) throw error

        setOrcamentos(prev => prev.map(o => o.id === editingOrcamento.id ? data : o))
      } else {
        // Criar novo orçamento
        const { data, error } = await supabase
          .from('orcamentos')
          .insert(orcamentoData)
          .select()
          .single()

        if (error) throw error

        setOrcamentos(prev => [data, ...prev])
      }

      resetForm()
      alert(editingOrcamento ? '✅ Orçamento atualizado!' : '✅ Orçamento criado!')
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error)
      alert('❌ Erro ao salvar orçamento. Tente novamente.')
    }
  }

  const resetForm = () => {
    setFormData({
      cliente_id: '',
      cliente_nome_avulso: '',
      descricao: '',
      observacoes: '',
      data_validade: '',
      incluir_qr_code: true
    })
    setItensOrcamento([])
    setEditingOrcamento(null)
    setShowModal(false)
  }

  const editOrcamento = (orcamento: Orcamento) => {
    setFormData({
      cliente_id: orcamento.cliente_id || '',
      cliente_nome_avulso: orcamento.cliente_nome_avulso || '',
      descricao: orcamento.descricao || '',
      observacoes: orcamento.observacoes || '',
      data_validade: orcamento.data_validade.split('T')[0],
      incluir_qr_code: orcamento.incluir_qr_code !== false
    })
    setItensOrcamento(orcamento.itens)
    setEditingOrcamento(orcamento)
    setShowModal(true)
  }

  const deleteOrcamento = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este orçamento?')) return

    try {
      const { error } = await supabase
        .from('orcamentos')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      setOrcamentos(prev => prev.filter(o => o.id !== id))
      alert('✅ Orçamento excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error)
      alert('❌ Erro ao excluir orçamento. Tente novamente.')
    }
  }

  const changeStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orcamentos')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      setOrcamentos(prev => prev.map(o => 
        o.id === id ? { ...o, status: newStatus } : o
      ))
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('❌ Erro ao alterar status. Tente novamente.')
    }
  }

  const adicionarItem = () => {
    const novoItem: OrcamentoItem = {
      id: Date.now().toString(),
      orcamento_id: '',
      receita_id: '',
      quantidade: 1,
      valor_unitario: 0,
      valor_total: 0
    }
    setItensOrcamento([...itensOrcamento, novoItem])
  }

  const removerItem = (index: number) => {
    setItensOrcamento(itensOrcamento.filter((_, i) => i !== index))
  }

  const atualizarItem = (index: number, campo: keyof OrcamentoItem, valor: any) => {
    const novosItens = [...itensOrcamento]
    novosItens[index] = { ...novosItens[index], [campo]: valor }
    
    if (campo === 'quantidade' || campo === 'valor_unitario') {
      novosItens[index].valor_total = novosItens[index].quantidade * novosItens[index].valor_unitario
    }
    
    if (campo === 'receita_id') {
      const receita = receitas.find(r => r.id === valor)
      if (receita && receita.preco_sugerido) {
        novosItens[index].valor_unitario = receita.preco_sugerido
        novosItens[index].valor_total = novosItens[index].quantidade * receita.preco_sugerido
      }
    }
    
    setItensOrcamento(novosItens)
  }

  const getClienteById = (id: string) => {
    return clientes.find(c => c.id === id)
  }

  const getReceitaById = (id: string) => {
    return receitas.find(r => r.id === id)
  }

  // Função para gerar QR Code do WhatsApp
  const generateWhatsAppQRCode = async (orcamento: Orcamento) => {
    try {
      const cliente = getClienteById(orcamento.cliente_id)
      const nomeCliente = cliente?.nome || orcamento.cliente_nome_avulso || 'Cliente não informado'
      
      let message = `🧁 *ORÇAMENTO DOCECALC*\n\n`
      message += `📄 *Número:* ${orcamento.numero_orcamento}\n`
      message += `👤 *Cliente:* ${nomeCliente}\n`
      message += `📅 *Válido até:* ${new Date(orcamento.data_validade).toLocaleDateString('pt-BR')}\n\n`
      
      if (orcamento.descricao) {
        message += `📝 *Descrição:* ${orcamento.descricao}\n\n`
      }
      
      message += `📋 *ITENS:*\n`
      orcamento.itens.forEach((item, index) => {
        const receita = getReceitaById(item.receita_id)
        message += `${index + 1}. ${receita?.nome} (${item.quantidade}x) - R$ ${item.valor_total.toFixed(2)}\n`
      })
      
      message += `\n💰 *VALOR TOTAL: R$ ${orcamento.valor_total.toFixed(2)}*\n\n`
      
      if (orcamento.observacoes) {
        message += `📝 *Observações:* ${orcamento.observacoes}\n\n`
      }
      
      message += `✨ _Orçamento gerado pelo DoceCalc_`
      
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
      
      if (orcamento.incluir_qr_code) {
        const qrCodeDataUrl = await QRCode.toDataURL(whatsappUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        return qrCodeDataUrl
      }
      
      return whatsappUrl
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      return null
    }
  }

  // Função para compartilhar diretamente no WhatsApp
  const shareToWhatsApp = async (orcamento: Orcamento) => {
    const whatsappUrl = await generateWhatsAppQRCode(orcamento)
    if (whatsappUrl && typeof whatsappUrl === 'string') {
      window.open(whatsappUrl, '_blank')
    }
  }

  // Função para mostrar QR Code
  const showQRCode = async (orcamento: Orcamento) => {
    try {
      const qrCode = await generateWhatsAppQRCode(orcamento)
      if (qrCode && typeof qrCode === 'string' && qrCode.startsWith('data:')) {
        setQrCodeImage(qrCode)
        setCurrentOrcamento(orcamento)
        setShowQRModal(true)
      } else {
        // Se não tem QR code, abre diretamente o WhatsApp
        shareToWhatsApp(orcamento)
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      shareToWhatsApp(orcamento)
    }
  }

  // Estatísticas
  const statsOrcamentos = {
    total: orcamentos.length,
    rascunho: orcamentos.filter(o => o.status === 'rascunho').length,
    enviado: orcamentos.filter(o => o.status === 'enviado').length,
    aprovado: orcamentos.filter(o => o.status === 'aprovado').length,
    valorTotal: orcamentos.reduce((total, o) => total + o.valor_total, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 lg:mb-2">
                Orçamentos
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Crie e gerencie orçamentos para seus clientes
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Orçamento</span>
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{statsOrcamentos.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rascunhos</p>
                <p className="text-2xl font-bold text-gray-900">{statsOrcamentos.rascunho}</p>
              </div>
              <Edit className="h-8 w-8 text-gray-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enviados</p>
                <p className="text-2xl font-bold text-gray-900">{statsOrcamentos.enviado}</p>
              </div>
              <Send className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-gray-900">{statsOrcamentos.aprovado}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {statsOrcamentos.valorTotal.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-card p-4 lg:p-6 rounded-lg shadow-md mb-6 lg:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar orçamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="todos">Todos os status</option>
              <option value="rascunho">Rascunho</option>
              <option value="enviado">Enviado</option>
              <option value="aprovado">Aprovado</option>
              <option value="rejeitado">Rejeitado</option>
              <option value="expirado">Expirado</option>
            </select>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <FileText className="h-5 w-5" />
              <span>{filteredOrcamentos.length} orçamentos encontrados</span>
            </div>
          </div>
        </div>

        {/* Lista de Orçamentos */}
        {filteredOrcamentos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {orcamentos.length === 0 ? 'Nenhum orçamento criado' : 'Nenhum orçamento encontrado'}
            </h3>
            <p className="text-gray-500 mb-6">
              {orcamentos.length === 0 
                ? 'Comece criando seu primeiro orçamento!' 
                : 'Tente ajustar os filtros para encontrar o que procura.'
              }
            </p>
            {orcamentos.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                Criar primeiro orçamento
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrcamentos.map(orcamento => {
              const cliente = getClienteById(orcamento.cliente_id)
              const isExpirado = new Date(orcamento.data_validade) < new Date()
              
              return (
                <div key={orcamento.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {orcamento.numero_orcamento}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {cliente?.nome || orcamento.cliente_nome_avulso || 'Cliente não informado'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(isExpirado && orcamento.status === 'enviado' ? 'expirado' : orcamento.status)}`}>
                        {getStatusIcon(isExpirado && orcamento.status === 'enviado' ? 'expirado' : orcamento.status)}
                        <span className="ml-1">
                          {isExpirado && orcamento.status === 'enviado' ? 'Expirado' : orcamento.status}
                        </span>
                      </span>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => showQRCode(orcamento)}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Compartilhar no WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        {orcamento.status === 'rascunho' && (
                          <button
                            onClick={() => changeStatus(orcamento.id, 'enviado')}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Enviar orçamento"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        {orcamento.status === 'enviado' && (
                          <>
                            <button
                              onClick={() => changeStatus(orcamento.id, 'aprovado')}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Aprovar orçamento"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => changeStatus(orcamento.id, 'rejeitado')}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Rejeitar orçamento"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => editOrcamento(orcamento)}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteOrcamento(orcamento.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Data de Criação</p>
                      <p className="font-medium">
                        {new Date(orcamento.data_criacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Válido até</p>
                      <p className={`font-medium ${isExpirado ? 'text-red-600' : ''}`}>
                        {new Date(orcamento.data_validade).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valor Total</p>
                      <p className="text-lg font-bold text-green-600">
                        R$ {orcamento.valor_total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  {orcamento.descricao && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Descrição</p>
                      <p className="text-gray-900">{orcamento.descricao}</p>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Itens ({orcamento.itens.length})
                    </p>
                    <div className="space-y-2">
                      {orcamento.itens.slice(0, 3).map(item => {
                        const receita = getReceitaById(item.receita_id)
                        return (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span>{receita?.nome} x{item.quantidade}</span>
                            <span className="font-medium">R$ {item.valor_total.toFixed(2)}</span>
                          </div>
                        )
                      })}
                      {orcamento.itens.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{orcamento.itens.length - 3} itens adicionais
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full m-4 max-h-screen overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {editingOrcamento ? 'Editar Orçamento' : 'Novo Orçamento'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente
                    </label>
                    <select
                      value={formData.cliente_id}
                      onChange={(e) => setFormData({...formData, cliente_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Orçamento Avulso (sem cliente)</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!formData.cliente_id && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Cliente (Opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.cliente_nome_avulso}
                        onChange={(e) => setFormData({...formData, cliente_nome_avulso: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ex: Maria Silva"
                      />
                    </div>
                  )}
                  
                  <div className={!formData.cliente_id ? 'md:col-start-1' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Válido até *
                    </label>
                    <input
                      type="date"
                      value={formData.data_validade}
                      onChange={(e) => setFormData({...formData, data_validade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Festa de aniversário - 50 pessoas"
                  />
                </div>
                
                {/* Itens do Orçamento */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Itens do Orçamento *
                    </label>
                    <button
                      type="button"
                      onClick={adicionarItem}
                      className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Adicionar Item</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {itensOrcamento.map((item, index) => (
                      <div key={index} className="border border-gray-200 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Receita
                            </label>
                            <select
                              value={item.receita_id}
                              onChange={(e) => atualizarItem(index, 'receita_id', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            >
                              <option value="">Selecione uma receita</option>
                              {receitas.map(receita => (
                                <option key={receita.id} value={receita.id}>
                                  {receita.nome}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quantidade
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantidade}
                              onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Valor Unitário (R$)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.valor_unitario}
                              onChange={(e) => atualizarItem(index, 'valor_unitario', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Total
                              </label>
                              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                                R$ {item.valor_total.toFixed(2)}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removerItem(index)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {itensOrcamento.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total do Orçamento:</span>
                        <span className="text-2xl font-bold text-green-600">
                          R$ {calcularTotalOrcamento(itensOrcamento).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Informações adicionais, condições de pagamento, etc."
                  />
                </div>

                {/* Opção QR Code */}
                <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <QrCode className="h-6 w-6 text-green-600" />
                  <div className="flex-1">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.incluir_qr_code}
                        onChange={(e) => setFormData({...formData, incluir_qr_code: e.target.checked})}
                        className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Incluir QR Code para WhatsApp
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Facilita o compartilhamento do orçamento via WhatsApp
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={itensOrcamento.length === 0}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingOrcamento ? 'Salvar Alterações' : 'Criar Orçamento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal QR Code */}
        {showQRModal && qrCodeImage && currentOrcamento && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Compartilhar no WhatsApp
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Escaneie o QR Code com seu celular para compartilhar o orçamento{' '}
                  <strong>{currentOrcamento.numero_orcamento}</strong> no WhatsApp
                </p>
                <div className="flex justify-center mb-6">
                  <img 
                    src={qrCodeImage} 
                    alt="QR Code WhatsApp" 
                    className="border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => shareToWhatsApp(currentOrcamento)}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Abrir WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}