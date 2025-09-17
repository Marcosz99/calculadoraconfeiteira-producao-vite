'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Users,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Send,
  Filter,
  X,
  Save,
  Calculator,
  Crown
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase-client'
import { formatarMoeda } from '@/lib/calculations-lib'

type StatusOrcamento = 'pendente' | 'aprovado' | 'rejeitado' | 'concluido'

type ItemOrcamento = {
  receita_id: string
  nome_receita: string
  quantidade: number
  preco_unitario: number
  subtotal: number
}

type Orcamento = {
  id: string
  user_id: string
  cliente_nome: string
  cliente_contato: string | null
  itens: ItemOrcamento[]
  valor_total: number
  status: StatusOrcamento
  observacoes: string | null
  valido_ate: string | null
  created_at: string
  updated_at: string
}

type Receita = {
  id: string
  nome: string
  preco_sugerido: number | null
  custo_calculado: number | null
}

export default function OrcamentosPage() {
  const { profile } = useAuth()
  const { toast } = useToast()
  
  // Estados principais
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  
  // Estados do formulário
  const [showForm, setShowForm] = useState(false)
  const [editingOrcamento, setEditingOrcamento] = useState<Orcamento | null>(null)
  const [showDetails, setShowDetails] = useState<Orcamento | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    cliente_nome: '',
    cliente_contato: '',
    observacoes: '',
    valido_ate: ''
  })

  const [itensOrcamento, setItensOrcamento] = useState<ItemOrcamento[]>([])

  const isPro = profile?.plano === 'pro'

  useEffect(() => {
    if (profile?.id) {
      loadOrcamentos()
      loadReceitas()
    }
  }, [profile?.id])

  const loadOrcamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrcamentos(data || [])
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error)
      toast({
        title: "Erro ao carregar orçamentos",
        description: "Não foi possível carregar os orçamentos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadReceitas = async () => {
    try {
      const { data, error } = await supabase
        .from('receitas')
        .select('id, nome, preco_sugerido, custo_calculado')
        .eq('user_id', profile?.id)
        .eq('ativa', true)
        .order('nome')

      if (error) throw error
      setReceitas(data || [])
    } catch (error) {
      console.error('Erro ao carregar receitas:', error)
    }
  }

  const adicionarItem = () => {
    setItensOrcamento([
      ...itensOrcamento,
      {
        receita_id: '',
        nome_receita: '',
        quantidade: 1,
        preco_unitario: 0,
        subtotal: 0
      }
    ])
  }

  const removerItem = (index: number) => {
    setItensOrcamento(itensOrcamento.filter((_, i) => i !== index))
  }

  const atualizarItem = (index: number, campo: string, valor: any) => {
    const novosItens = [...itensOrcamento]
    
    if (campo === 'receita_id') {
      const receita = receitas.find(r => r.id === valor)
      if (receita) {
        novosItens[index] = {
          ...novosItens[index],
          receita_id: valor,
          nome_receita: receita.nome,
          preco_unitario: receita.preco_sugerido || receita.custo_calculado || 0
        }
      }
    } else {
      novosItens[index] = { ...novosItens[index], [campo]: valor }
    }

    // Recalcular subtotal
    if (campo === 'quantidade' || campo === 'preco_unitario' || campo === 'receita_id') {
      novosItens[index].subtotal = novosItens[index].quantidade * novosItens[index].preco_unitario
    }

    setItensOrcamento(novosItens)
  }

  const calcularTotal = () => {
    return itensOrcamento.reduce((total, item) => total + item.subtotal, 0)
  }

  const handleSaveOrcamento = async () => {
    if (!formData.cliente_nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome do cliente é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (itensOrcamento.length === 0) {
      toast({
        title: "Itens necessários",
        description: "Adicione pelo menos um item ao orçamento.",
        variant: "destructive",
      })
      return
    }

    const itensValidos = itensOrcamento.filter(item => 
      item.receita_id && item.quantidade > 0 && item.preco_unitario > 0
    )

    if (itensValidos.length === 0) {
      toast({
        title: "Itens inválidos",
        description: "Verifique se todos os itens têm receita, quantidade e preço válidos.",
        variant: "destructive",
      })
      return
    }

    try {
      const orcamentoData = {
        ...formData,
        user_id: profile?.id,
        itens: itensValidos,
        valor_total: calcularTotal(),
        updated_at: new Date().toISOString()
      }

      let result
      if (editingOrcamento) {
        result = await supabase
          .from('orcamentos')
          .update(orcamentoData)
          .eq('id', editingOrcamento.id)
          .eq('user_id', profile?.id)
          .select()
          .single()
      } else {
        // Para novos orçamentos, definir status e created_at explicitamente
        const novoOrcamentoData = {
          ...orcamentoData,
          status: 'pendente',
          created_at: new Date().toISOString()
        }
        
        result = await supabase
          .from('orcamentos')
          .insert(novoOrcamentoData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      toast({
        title: editingOrcamento ? "Orçamento atualizado!" : "Orçamento criado! 💼",
        description: `Orçamento para ${formData.cliente_nome} foi ${editingOrcamento ? 'atualizado' : 'criado'} com sucesso.`,
      })

      // Reset form
      setFormData({
        cliente_nome: '',
        cliente_contato: '',
        observacoes: '',
        valido_ate: ''
      })
      setItensOrcamento([])
      setShowForm(false)
      setEditingOrcamento(null)
      
      // Reload orçamentos
      loadOrcamentos()

    } catch (error) {
      console.error('Erro ao salvar orçamento:', error)
      toast({
        title: "Erro ao salvar orçamento",
        description: "Não foi possível salvar o orçamento.",
        variant: "destructive",
      })
    }
  }

  const handleEditOrcamento = (orcamento: Orcamento) => {
    setFormData({
      cliente_nome: orcamento.cliente_nome,
      cliente_contato: orcamento.cliente_contato || '',
      observacoes: orcamento.observacoes || '',
      valido_ate: orcamento.valido_ate || ''
    })
    setItensOrcamento(orcamento.itens)
    setEditingOrcamento(orcamento)
    setShowForm(true)
  }

  const handleUpdateStatus = async (orcamento: Orcamento, novoStatus: StatusOrcamento) => {
    try {
      const { error } = await supabase
        .from('orcamentos')
        .update({ 
          status: novoStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orcamento.id)
        .eq('user_id', profile?.id)

      if (error) throw error

      toast({
        title: "Status atualizado",
        description: `Orçamento marcado como ${novoStatus}.`,
      })

      loadOrcamentos()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do orçamento.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteOrcamento = async (orcamento: Orcamento) => {
    if (!confirm(`Tem certeza que deseja excluir o orçamento para "${orcamento.cliente_nome}"?`)) return

    try {
      const { error } = await supabase
        .from('orcamentos')
        .delete()
        .eq('id', orcamento.id)
        .eq('user_id', profile?.id)

      if (error) throw error

      toast({
        title: "Orçamento excluído",
        description: `Orçamento para ${orcamento.cliente_nome} foi excluído.`,
      })

      loadOrcamentos()
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error)
      toast({
        title: "Erro ao excluir orçamento",
        description: "Não foi possível excluir o orçamento.",
        variant: "destructive",
      })
    }
  }

  const gerarPdfOrcamento = (orcamento: Orcamento) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Orçamento - ${orcamento.cliente_nome}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px; 
          color: #333;
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #e91e63; 
          padding-bottom: 20px; 
          margin-bottom: 30px; 
        }
        .logo { 
          font-size: 24px; 
          font-weight: bold; 
          color: #e91e63; 
        }
        .client-info { 
          background-color: #f8f9fa; 
          padding: 15px; 
          border-radius: 8px; 
          margin-bottom: 20px; 
        }
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
        }
        .items-table th, .items-table td { 
          border: 1px solid #ddd; 
          padding: 12px; 
          text-align: left; 
        }
        .items-table th { 
          background-color: #e91e63; 
          color: white; 
        }
        .total { 
          text-align: right; 
          font-size: 18px; 
          font-weight: bold; 
          margin-top: 20px; 
          padding: 15px; 
          background-color: #f8f9fa; 
          border-radius: 8px; 
        }
        .footer { 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #ddd; 
          text-align: center; 
          color: #666; 
          font-size: 12px; 
        }
        .status { 
          display: inline-block; 
          padding: 4px 12px; 
          border-radius: 16px; 
          font-size: 12px; 
          font-weight: bold; 
        }
        .status.pendente { background-color: #fff3cd; color: #856404; }
        .status.aprovado { background-color: #d4edda; color: #155724; }
        .status.rejeitado { background-color: #f8d7da; color: #721c24; }
        .status.concluido { background-color: #d1ecf1; color: #0c5460; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🍰 DoceCalc</div>
        <h2>Orçamento Profissional</h2>
        <p>Data: ${new Date(orcamento.created_at).toLocaleDateString('pt-BR')}</p>
      </div>

      <div class="client-info">
        <h3>Dados do Cliente</h3>
        <p><strong>Nome:</strong> ${orcamento.cliente_nome}</p>
        ${orcamento.cliente_contato ? `<p><strong>Contato:</strong> ${orcamento.cliente_contato}</p>` : ''}
        <p><strong>Status:</strong> 
          <span class="status ${orcamento.status}">${orcamento.status.toUpperCase()}</span>
        </p>
        ${orcamento.valido_ate ? `<p><strong>Válido até:</strong> ${new Date(orcamento.valido_ate).toLocaleDateString('pt-BR')}</p>` : ''}
      </div>

      <h3>Itens do Orçamento</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantidade</th>
            <th>Preço Unitário</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${orcamento.itens.map(item => `
            <tr>
              <td>${item.nome_receita}</td>
              <td>${item.quantidade}</td>
              <td>R$ ${item.preco_unitario.toFixed(2)}</td>
              <td>R$ ${item.subtotal.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total">
        <p>Valor Total: R$ ${orcamento.valor_total.toFixed(2)}</p>
      </div>

      ${orcamento.observacoes ? `
        <div style="margin-top: 20px;">
          <h3>Observações</h3>
          <p>${orcamento.observacoes}</p>
        </div>
      ` : ''}

      <div class="footer">
        <p>Orçamento gerado pelo DoceCalc - Sistema de Gestão para Confeiteiras</p>
        <p>Este orçamento é válido conforme condições especificadas.</p>
      </div>

      <div class="no-print" style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()" style="background: #e91e63; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">
          🖨️ Imprimir / Salvar PDF
        </button>
        <button onclick="window.close()" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; margin-left: 10px;">
          ✕ Fechar
        </button>
      </div>
    </body>
    </html>
    `

    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(htmlContent)
      newWindow.document.close()
    } else {
      toast({
        title: "Erro ao exportar",
        description: "Não foi possível abrir a janela de exportação. Verifique se pop-ups estão permitidos.",
        variant: "destructive",
      })
    }
  }

  // Filter orçamentos
  const orcamentosFiltrados = orcamentos.filter(orcamento => {
    const matchesSearch = orcamento.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || orcamento.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: StatusOrcamento) => {
    const configs = {
      pendente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pendente' },
      aprovado: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Aprovado' },
      rejeitado: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejeitado' },
      concluido: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'Concluído' }
    }
    
    const config = configs[status]
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center py-8 px-4">
        <Card className="max-w-lg mx-auto text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-gradient-doce rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Funcionalidade PRO</CardTitle>
            <CardDescription>
              O sistema de orçamentos profissionais está disponível apenas no plano PRO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Orçamentos ilimitados para clientes</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Controle de status e validade</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Exportação em PDF profissional</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Histórico completo de orçamentos</span>
              </div>
            </div>
            
            <Button asChild className="w-full mt-6" variant="doce">
              <a href="/dashboard/upgrade">
                <Crown className="h-4 w-4 mr-2" />
                Fazer Upgrade para PRO
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Orçamentos Profissionais
            </h1>
            <Badge className="bg-gradient-doce text-white">
              <Crown className="h-3 w-3 mr-1" />
              PRO
            </Badge>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Crie e gerencie orçamentos profissionais para seus clientes com controle completo de status e validade
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={() => setShowForm(true)}
            variant="doce" 
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Orçamento
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Buscar Cliente</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nome do cliente..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Todos os status</option>
                  <option value="pendente">Pendente</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="rejeitado">Rejeitado</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setFilterStatus('')
                  }}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Orçamento */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {editingOrcamento ? 'Editar Orçamento' : 'Novo Orçamento'}
                  </CardTitle>
                  <CardDescription>
                    {editingOrcamento ? 'Atualize os dados do orçamento' : 'Crie um novo orçamento para seu cliente'}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowForm(false)
                    setEditingOrcamento(null)
                    setFormData({
                      cliente_nome: '',
                      cliente_contato: '',
                      observacoes: '',
                      valido_ate: ''
                    })
                    setItensOrcamento([])
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dados do Cliente */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Dados do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cliente">Nome do Cliente *</Label>
                    <Input
                      id="cliente"
                      value={formData.cliente_nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, cliente_nome: e.target.value }))}
                      placeholder="Nome completo ou empresa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contato">Contato</Label>
                    <Input
                      id="contato"
                      value={formData.cliente_contato}
                      onChange={(e) => setFormData(prev => ({ ...prev, cliente_contato: e.target.value }))}
                      placeholder="Telefone ou email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="validade">Válido até</Label>
                    <Input
                      id="validade"
                      type="date"
                      value={formData.valido_ate}
                      onChange={(e) => setFormData(prev => ({ ...prev, valido_ate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Itens do Orçamento */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Itens do Orçamento
                  </h3>
                  <Button onClick={adicionarItem} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Item
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {itensOrcamento.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                      <div className="col-span-4">
                        <Label className="text-xs">Receita</Label>
                        <select
                          value={item.receita_id}
                          onChange={(e) => atualizarItem(index, 'receita_id', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Selecione uma receita</option>
                          {receitas.map(receita => (
                            <option key={receita.id} value={receita.id}>
                              {receita.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Quantidade</Label>
                        <Input
                          type="number"
                          value={item.quantidade}
                          onChange={(e) => atualizarItem(index, 'quantidade', Number(e.target.value))}
                          min="1"
                          className="h-10"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Preço Unit. (R$)</Label>
                        <Input
                          type="number"
                          value={item.preco_unitario}
                          onChange={(e) => atualizarItem(index, 'preco_unitario', Number(e.target.value))}
                          min="0"
                          step="0.01"
                          className="h-10"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Subtotal</Label>
                        <div className="h-10 px-3 py-2 bg-gray-50 rounded-md flex items-center text-sm font-medium">
                          {formatarMoeda(item.subtotal)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button
                          onClick={() => removerItem(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {itensOrcamento.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum item adicionado ainda</p>
                      <p className="text-sm">Clique em "Adicionar Item" para começar</p>
                    </div>
                  )}
                </div>
                
                {itensOrcamento.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total do Orçamento:</span>
                      <span className="text-primary">{formatarMoeda(calcularTotal())}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações adicionais, condições de pagamento, etc."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSaveOrcamento} variant="doce">
                  <Save className="h-4 w-4 mr-2" />
                  {editingOrcamento ? 'Atualizar Orçamento' : 'Criar Orçamento'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowForm(false)
                    setEditingOrcamento(null)
                    setFormData({
                      cliente_nome: '',
                      cliente_contato: '',
                      observacoes: '',
                      valido_ate: ''
                    })
                    setItensOrcamento([])
                  }}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Orçamentos */}
        <div className="space-y-4">
          {orcamentosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || filterStatus ? 'Nenhum orçamento encontrado' : 'Nenhum orçamento criado ainda'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterStatus 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Crie seu primeiro orçamento para começar a gerenciar propostas para clientes'
                  }
                </p>
                {!searchTerm && !filterStatus && (
                  <Button onClick={() => setShowForm(true)} variant="doce">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Orçamento
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            orcamentosFiltrados.map(orcamento => (
              <Card key={orcamento.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {orcamento.cliente_nome}
                        </h3>
                        {getStatusBadge(orcamento.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="font-medium">{formatarMoeda(orcamento.valor_total)}</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{orcamento.itens.length} {orcamento.itens.length === 1 ? 'item' : 'itens'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Criado em {formatDate(orcamento.created_at)}</span>
                        </div>
                        {orcamento.valido_ate && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Válido até {formatDate(orcamento.valido_ate)}</span>
                          </div>
                        )}
                      </div>

                      {orcamento.cliente_contato && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Contato:</strong> {orcamento.cliente_contato}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setShowDetails(orcamento)}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => gerarPdfOrcamento(orcamento)}
                        size="sm"
                        variant="outline"
                        className="text-primary hover:bg-primary/10"
                        title="Exportar PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleEditOrcamento(orcamento)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {/* Status Actions */}
                      {orcamento.status === 'pendente' && (
                        <>
                          <Button
                            onClick={() => handleUpdateStatus(orcamento, 'aprovado')}
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleUpdateStatus(orcamento, 'rejeitado')}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {orcamento.status === 'aprovado' && (
                        <Button
                          onClick={() => handleUpdateStatus(orcamento, 'concluido')}
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleDeleteOrcamento(orcamento)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal de Detalhes */}
        {showDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Detalhes do Orçamento</span>
                    </CardTitle>
                    <CardDescription>
                      Orçamento para {showDetails.cliente_nome}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowDetails(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informações do Cliente */}
                <div>
                  <h3 className="font-semibold mb-3">Informações do Cliente</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nome:</span>
                      <p className="font-medium">{showDetails.cliente_nome}</p>
                    </div>
                    {showDetails.cliente_contato && (
                      <div>
                        <span className="text-gray-600">Contato:</span>
                        <p className="font-medium">{showDetails.cliente_contato}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <div className="mt-1">{getStatusBadge(showDetails.status)}</div>
                    </div>
                    {showDetails.valido_ate && (
                      <div>
                        <span className="text-gray-600">Válido até:</span>
                        <p className="font-medium">{formatDate(showDetails.valido_ate)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Itens */}
                <div>
                  <h3 className="font-semibold mb-3">Itens do Orçamento</h3>
                  <div className="space-y-3">
                    {showDetails.itens.map((item, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg text-sm">
                        <div>
                          <span className="text-gray-600">Receita:</span>
                          <p className="font-medium">{item.nome_receita}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Quantidade:</span>
                          <p className="font-medium">{item.quantidade}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Preço Unit.:</span>
                          <p className="font-medium">{formatarMoeda(item.preco_unitario)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Subtotal:</span>
                          <p className="font-medium">{formatarMoeda(item.subtotal)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total do Orçamento:</span>
                      <span className="text-primary">{formatarMoeda(showDetails.valor_total)}</span>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                {showDetails.observacoes && (
                  <div>
                    <h3 className="font-semibold mb-3">Observações</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {showDetails.observacoes}
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button variant="doce" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar por Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}