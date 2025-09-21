import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Search, User, Phone, Mail, Calendar, Edit, Trash2, MessageCircle, QrCode, Brain, Upload, Download, MapPin, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Cliente, QRCodeCadastro, ImportacaoIA } from '../types'
import QRCodeGenerator from '../components/QRCodeGenerator'
import { LOCAL_STORAGE_KEYS, saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage'

export default function ClientesPage() {
  const { user } = useAuth()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    whatsapp: '',
    email: '',
    endereco_completo: '',
    data_nascimento: '',
    observacoes: ''
  })

  // FASE 7: Estados para Cadastro Inteligente de Clientes
  const [showCadastroOptions, setShowCadastroOptions] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showIAModal, setShowIAModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [qrCodeCadastro, setQRCodeCadastro] = useState<QRCodeCadastro | null>(null)
  const [dadosWhatsApp, setDadosWhatsApp] = useState('')
  const [clientesIA, setClientesIA] = useState<Cliente[]>([])
  const [arquivoCSV, setArquivoCSV] = useState<File | null>(null)
  const [previewImport, setPreviewImport] = useState<Cliente[]>([])
  const [processandoIA, setProcessandoIA] = useState(false)

  useEffect(() => {
    if (user) {
      const savedClientes = getFromLocalStorage<Cliente[]>(LOCAL_STORAGE_KEYS.CLIENTES, [])
      setClientes(savedClientes.filter(c => c.usuario_id === user.id && c.ativo))
    }
  }, [user])

  const filteredClientes = clientes.filter(cliente => {
    const searchLower = searchTerm.toLowerCase()
    return cliente.nome.toLowerCase().includes(searchLower) ||
           cliente.telefone?.toLowerCase().includes(searchLower) ||
           cliente.email?.toLowerCase().includes(searchLower)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const clienteData: Cliente = {
      id: editingCliente?.id || Date.now().toString(),
      usuario_id: user.id,
      nome: formData.nome,
      telefone: formData.telefone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      endereco_completo: formData.endereco_completo,
      data_nascimento: formData.data_nascimento,
      observacoes: formData.observacoes,
      criado_em: editingCliente?.criado_em || new Date().toISOString(),
      ativo: true,
      historico_pedidos: editingCliente?.historico_pedidos || 0,
      valor_total_gasto: editingCliente?.valor_total_gasto || 0
    }

    let updatedClientes
    if (editingCliente) {
      updatedClientes = clientes.map(c => 
        c.id === editingCliente.id ? clienteData : c
      )
    } else {
      updatedClientes = [...clientes, clienteData]
    }

    setClientes(updatedClientes)

    // Salvar todos os clientes
    const allClientes = getFromLocalStorage<Cliente[]>(LOCAL_STORAGE_KEYS.CLIENTES, [])
    const otherUsersClientes = allClientes.filter(c => c.usuario_id !== user.id)
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES, [...otherUsersClientes, ...updatedClientes])

    resetForm()
  }

  // FASE 7: Funções do Sistema Inteligente de Clientes

  // 1. QR Code de Cadastro
  const gerarQRCode = () => {
    if (!user) return

    const novoQR: QRCodeCadastro = {
      id: Date.now().toString(),
      usuario_id: user.id,
      codigo_qr: `https://docecalc.app/cadastro/${user.id}/${Date.now()}`,
      nome_confeitaria: user.name || 'Minha Confeitaria',
      ativo: true,
      criado_em: new Date().toISOString(),
      clientes_cadastrados: 0
    }

    setQRCodeCadastro(novoQR)
    saveToLocalStorage('qr_codes_cadastro', [novoQR])
    setShowQRModal(true)
  }

  // 2. IA de Texto para extrair dados do WhatsApp
  const processarDadosWhatsApp = async () => {
    if (!dadosWhatsApp.trim() || !user) return
    
    setProcessandoIA(true)
    
    try {
      // Simular processamento de IA (em produção usaria API real)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Extrair dados básicos usando regex simples (simulação)
      const linhas = dadosWhatsApp.split('\n')
      const clientesExtraidos: Cliente[] = []
      
      let nomeAtual = ''
      let telefoneAtual = ''
      
      for (const linha of linhas) {
        // Tentar extrair nome e telefone de conversas WhatsApp
        const matchTelefone = linha.match(/\+?[\d\s\(\)\-]{10,}/g)
        const matchNome = linha.match(/^([A-Za-zÀ-ÿ\s]+)[\s:]/g)
        
        if (matchNome && matchNome[0]) {
          nomeAtual = matchNome[0].replace(':', '').trim()
        }
        
        if (matchTelefone && matchTelefone[0] && nomeAtual) {
          telefoneAtual = matchTelefone[0].replace(/\D/g, '')
          
          if (telefoneAtual.length >= 10 && nomeAtual.length > 2) {
            const novoCliente: Cliente = {
              id: Date.now().toString() + Math.random().toString(),
              usuario_id: user.id,
              nome: nomeAtual,
              telefone: telefoneAtual,
              whatsapp: telefoneAtual,
              email: '',
              endereco_completo: '',
              data_nascimento: '',
              observacoes: 'Importado via IA do WhatsApp',
              criado_em: new Date().toISOString(),
              ativo: true,
              historico_pedidos: 0,
              valor_total_gasto: 0
            }
            
            clientesExtraidos.push(novoCliente)
            nomeAtual = ''
            telefoneAtual = ''
          }
        }
      }
      
      setClientesIA(clientesExtraidos)
      
    } catch (error) {
      alert('Erro ao processar dados. Tente novamente.')
    } finally {
      setProcessandoIA(false)
    }
  }

  // 3. Import de arquivo CSV/TXT
  const processarArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0]
    if (!arquivo || !user) return

    setArquivoCSV(arquivo)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const texto = e.target?.result as string
      const linhas = texto.split('\n').filter(linha => linha.trim())
      const clientesImportados: Cliente[] = []
      
      // Assumir formato: Nome, Telefone, Email, Endereço
      for (let i = 1; i < linhas.length; i++) { // Pular cabeçalho
        const colunas = linhas[i].split(',').map(col => col.trim())
        
        if (colunas.length >= 2 && colunas[0] && colunas[1]) {
          const novoCliente: Cliente = {
            id: Date.now().toString() + i,
            usuario_id: user.id,
            nome: colunas[0] || '',
            telefone: colunas[1]?.replace(/\D/g, '') || '',
            whatsapp: colunas[1]?.replace(/\D/g, '') || '',
            email: colunas[2] || '',
            endereco_completo: colunas[3] || '',
            data_nascimento: '',
            observacoes: 'Importado via CSV/TXT',
            criado_em: new Date().toISOString(),
            ativo: true,
            historico_pedidos: 0,
            valor_total_gasto: 0
          }
          
          clientesImportados.push(novoCliente)
        }
      }
      
      setPreviewImport(clientesImportados)
    }
    
    reader.readAsText(arquivo)
  }

  // Confirmar import em lote
  const confirmarImport = () => {
    if (previewImport.length === 0) return

    const novosClientes = [...clientes, ...previewImport]
    setClientes(novosClientes)

    // Salvar todos os clientes
    const allClientes = getFromLocalStorage<Cliente[]>(LOCAL_STORAGE_KEYS.CLIENTES, [])
    const otherUsersClientes = allClientes.filter(c => c.usuario_id !== user?.id)
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES, [...otherUsersClientes, ...novosClientes])

    setShowImportModal(false)
    setPreviewImport([])
    setArquivoCSV(null)
    alert(`✅ ${previewImport.length} clientes importados com sucesso!`)
  }

  // Validação e enriquecimento de dados
  const validarTelefone = (telefone: string): boolean => {
    const telefoneNumeros = telefone.replace(/\D/g, '')
    return telefoneNumeros.length >= 10 && telefoneNumeros.length <= 11
  }

  const validarEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const formatarTelefone = (telefone: string): string => {
    const numeros = telefone.replace(/\D/g, '')
    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
    } else if (numeros.length === 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
    }
    return telefone
  }

  // Confirmar clientes extraídos pela IA
  const confirmarClientesIA = () => {
    if (clientesIA.length === 0) return

    const novosClientes = [...clientes, ...clientesIA]
    setClientes(novosClientes)

    // Salvar todos os clientes
    const allClientes = getFromLocalStorage<Cliente[]>(LOCAL_STORAGE_KEYS.CLIENTES, [])
    const otherUsersClientes = allClientes.filter(c => c.usuario_id !== user?.id)
    saveToLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES, [...otherUsersClientes, ...novosClientes])

    setShowIAModal(false)
    setClientesIA([])
    setDadosWhatsApp('')
    alert(`✅ ${clientesIA.length} clientes importados via IA!`)
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      telefone: '',
      whatsapp: '',
      email: '',
      endereco_completo: '',
      data_nascimento: '',
      observacoes: ''
    })
    setEditingCliente(null)
    setShowModal(false)
  }

  const editCliente = (cliente: Cliente) => {
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone || '',
      whatsapp: cliente.whatsapp || '',
      email: cliente.email || '',
      endereco_completo: cliente.endereco_completo || '',
      data_nascimento: cliente.data_nascimento || '',
      observacoes: cliente.observacoes || ''
    })
    setEditingCliente(cliente)
    setShowModal(true)
  }

  const deleteCliente = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      const updatedClientes = clientes.map(c => 
        c.id === id ? { ...c, ativo: false } : c
      )
      setClientes(updatedClientes.filter(c => c.ativo))
      
      const allClientes = getFromLocalStorage<Cliente[]>(LOCAL_STORAGE_KEYS.CLIENTES, [])
      const updatedAllClientes = allClientes.map(c => 
        c.id === id ? { ...c, ativo: false } : c
      )
      saveToLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES, updatedAllClientes)
    }
  }


  const abrirWhatsApp = (whatsapp: string, nome: string) => {
    const numeroLimpo = whatsapp.replace(/\D/g, '')
    const mensagem = encodeURIComponent(`Olá ${nome}! Tudo bem?`)
    window.open(`https://wa.me/55${numeroLimpo}?text=${mensagem}`, '_blank')
  }

  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return null
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return idade
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
                Clientes
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Gerencie seus clientes e histórico de pedidos
              </p>
            </div>
          </div>
          
          {/* FASE 7: Menu de Cadastro Inteligente */}
          <div className="relative">
            <button
              onClick={() => setShowCadastroOptions(!showCadastroOptions)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Cadastrar Cliente</span>
              <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showCadastroOptions && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowModal(true)
                      setShowCadastroOptions(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md flex items-center space-x-3"
                  >
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Cadastro Manual</p>
                      <p className="text-sm text-gray-500">Preencha os dados do cliente manualmente</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      gerarQRCode()
                      setShowCadastroOptions(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md flex items-center space-x-3"
                  >
                    <QrCode className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">QR Code de Cadastro</p>
                      <p className="text-sm text-gray-500">Clientes escaneia e se cadastra sozinho</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowIAModal(true)
                      setShowCadastroOptions(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md flex items-center space-x-3"
                  >
                    <Brain className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900">IA de WhatsApp</p>
                      <p className="text-sm text-gray-500">Cole conversas e extraia dados automaticamente</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowImportModal(true)
                      setShowCadastroOptions(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md flex items-center space-x-3"
                  >
                    <Upload className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">Import de Arquivo</p>
                      <p className="text-sm text-gray-500">CSV/TXT com dados de clientes em lote</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientes.filter(c => c.historico_pedidos > 0).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Com WhatsApp</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientes.filter(c => c.whatsapp).length}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {clientes.reduce((total, c) => total + c.valor_total_gasto, 0).toFixed(2)}
                </p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Busca */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes por nome, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Lista de Clientes */}
        {filteredClientes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <User className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {clientes.length === 0 ? 'Nenhum cliente cadastrado' : 'Nenhum cliente encontrado'}
            </h3>
            <p className="text-gray-500 mb-6">
              {clientes.length === 0 
                ? 'Comece adicionando seu primeiro cliente!' 
                : 'Tente ajustar os termos de busca.'
              }
            </p>
            {clientes.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Adicionar primeiro cliente
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {filteredClientes.map(cliente => {
              const idade = calcularIdade(cliente.data_nascimento || '')
              
              return (
                <div key={cliente.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{cliente.nome}</h3>
                        {idade && (
                          <p className="text-sm text-gray-500">{idade} anos</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => editCliente(cliente)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCliente(cliente.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {cliente.telefone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{formatarTelefone(cliente.telefone)}</span>
                      </div>
                    )}
                    
                    {cliente.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{cliente.email}</span>
                      </div>
                    )}
                    
                    {cliente.whatsapp && (
                      <button
                        onClick={() => abrirWhatsApp(cliente.whatsapp!, cliente.nome)}
                        className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{cliente.historico_pedidos}</p>
                        <p className="text-xs text-gray-500">Pedidos</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-green-600">
                          R$ {cliente.valor_total_gasto.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Total Gasto</p>
                      </div>
                    </div>
                  </div>
                  
                  {cliente.observacoes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{cliente.observacoes}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4 max-h-screen overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={formData.data_nascimento}
                      onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço Completo
                  </label>
                  <textarea
                    value={formData.endereco_completo}
                    onChange={(e) => setFormData({...formData, endereco_completo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Preferências, alergias, informações importantes..."
                  />
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
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    {editingCliente ? 'Salvar Alterações' : 'Adicionar Cliente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FASE 7: Modal QR Code de Cadastro */}
        {showQRModal && qrCodeCadastro && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <QrCode className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  QR Code de Cadastro
                </h3>
                <p className="text-gray-600 mb-6">
                  Mostre este QR Code para seus clientes se cadastrarem sozinhos
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <QRCodeGenerator
                    value={qrCodeCadastro.codigo_qr}
                    size={200}
                    className="mx-auto"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {qrCodeCadastro.nome_confeitaria}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-700">
                    📱 Clientes escaneiam → preenchem dados básicos → dados chegam direto no seu CRM!
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      // Simular download do QR Code
                      alert('QR Code salvo! (Funcionalidade de download seria implementada aqui)')
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Baixar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FASE 7: Modal IA de WhatsApp */}
        {showIAModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Brain className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">IA de WhatsApp</h3>
                    <p className="text-sm text-gray-600">Extraia dados automaticamente de conversas</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIAModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cole sua conversa do WhatsApp aqui:
                </label>
                <textarea
                  value={dadosWhatsApp}
                  onChange={(e) => setDadosWhatsApp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={8}
                  placeholder="Exemplo:
João Silva: Olá! Gostaria de fazer um pedido
Maria (11) 99999-9999: Oi João! Claro, me fala o que você precisa
João Silva: Um bolo de chocolate para 20 pessoas..."
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-700">
                  🤖 A IA irá identificar nomes e telefones automaticamente. Funciona melhor com conversas que incluem nomes e números de telefone visíveis.
                </p>
              </div>

              {clientesIA.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Clientes encontrados ({clientesIA.length}):
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {clientesIA.map((cliente, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{cliente.nome}</p>
                          <p className="text-sm text-gray-600">{formatarTelefone(cliente.telefone)}</p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowIAModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                
                {clientesIA.length > 0 ? (
                  <button
                    onClick={confirmarClientesIA}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Confirmar {clientesIA.length} Clientes</span>
                  </button>
                ) : (
                  <button
                    onClick={processarDadosWhatsApp}
                    disabled={processandoIA || !dadosWhatsApp.trim()}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {processandoIA ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        <span>Processar com IA</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FASE 7: Modal Import de Arquivo */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Upload className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Import de Arquivo</h3>
                    <p className="text-sm text-gray-600">Importe clientes em lote via CSV/TXT</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione um arquivo CSV ou TXT:
                </label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={processarArquivo}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-700 font-medium mb-2">Formato esperado:</p>
                <p className="text-sm text-green-600">
                  <code>Nome, Telefone, Email, Endereço</code>
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Exemplo: "João Silva, (11) 99999-9999, joao@email.com, Rua A, 123"
                </p>
              </div>

              {previewImport.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Preview ({previewImport.length} clientes encontrados):
                  </h4>
                  <div className="bg-gray-50 border rounded-lg">
                    <div className="max-h-60 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left p-3 border-b">Nome</th>
                            <th className="text-left p-3 border-b">Telefone</th>
                            <th className="text-left p-3 border-b">Email</th>
                            <th className="text-left p-3 border-b">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewImport.map((cliente, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-3">{cliente.nome}</td>
                              <td className="p-3">{formatarTelefone(cliente.telefone)}</td>
                              <td className="p-3">{cliente.email || '-'}</td>
                              <td className="p-3">
                                <div className="flex items-center space-x-1">
                                  {validarTelefone(cliente.telefone) ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <span className="text-red-500 text-xs">Telefone inválido</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                
                {previewImport.length > 0 && (
                  <button
                    onClick={confirmarImport}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Importar {previewImport.length} Clientes</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}