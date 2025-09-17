import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Search, User, Phone, Mail, Calendar, Edit, Trash2, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Cliente } from '../types'
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

  const formatarTelefone = (telefone: string) => {
    const numeros = telefone.replace(/\D/g, '')
    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
    }
    return telefone
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard"
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Clientes
              </h1>
              <p className="text-gray-600">
                Gerencie seus clientes e histórico de pedidos
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Cliente</span>
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  )
}