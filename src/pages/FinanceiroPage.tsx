import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Upload, 
  Camera, 
  FileText, 
  Calculator,
  PiggyBank,
  Target,
  Calendar,
  Plus,
  X,
  Loader,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Edit2,
  Receipt
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import AdvancedCharts from '@/components/AdvancedCharts'
import { FinancialActionButtons } from '@/components/FinancialActionButtons'
import { useSupabaseFinanceiro, TransacaoFinanceira, GastoPlanejado } from '@/hooks/useSupabaseFinanceiro'

import { processFinancialDataForCharts } from '@/utils/chartDataProcessor'

export default function FinanceiroPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Hook do Supabase
  const {
    transacoes,
    gastosPlanejados,
    loading,
    totais,
    addTransacao,
    updateTransacao,
    deleteTransacao,
    addGastoPlanejado,
    updateGastoPlanejado,
    deleteGastoPlanejado
  } = useSupabaseFinanceiro()

  // Estados
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showManualModal, setShowManualModal] = useState(false)
  const [uploadType, setUploadType] = useState<'receita' | 'despesa' | null>(null)
  const [processandoOCR, setProcessandoOCR] = useState(false)
  const [dadosExtraidos, setDadosExtraidos] = useState<any>(null)
  const [showGastoModal, setShowGastoModal] = useState(false)

  // Estados para transação manual
  const [novaTransacao, setNovaTransacao] = useState<{
    tipo: 'receita' | 'despesa';
    categoria: string;
    valor: number;
    descricao: string;
    data: string;
    metodo_pagamento: string;
  }>({
    tipo: 'receita',
    categoria: '',
    valor: 0,
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    metodo_pagamento: ''
  })

  // Estado para novo gasto planejado
  const [novoGastoPlanejado, setNovoGastoPlanejado] = useState({
    nome: '',
    valor_estimado: 0,
    data_vencimento: '',
    categoria: 'Outros',
    observacoes: ''
  })

  // Processar dados para gráficos
  const chartData = processFinancialDataForCharts(transacoes)

  // Função para salvar transação manual
  const salvarTransacaoManual = async () => {
    if (!novaTransacao.categoria || !novaTransacao.valor || !novaTransacao.data) {
      toast({
        title: '❌ Campos obrigatórios',
        description: 'Preencha categoria, valor e data',
        variant: 'destructive'
      })
      return
    }

    const success = await addTransacao({
      tipo: novaTransacao.tipo,
      categoria: novaTransacao.categoria,
      valor: novaTransacao.valor,
      descricao: novaTransacao.descricao,
      data_transacao: novaTransacao.data,
      metodo_pagamento: novaTransacao.metodo_pagamento
    })

    if (success) {
      // Reset do formulário
      setNovaTransacao({
        tipo: 'receita',
        categoria: '',
        valor: 0,
        descricao: '',
        data: new Date().toISOString().split('T')[0],
        metodo_pagamento: ''
      })
      setShowManualModal(false)
    }
  }

  // Função para salvar gasto planejado
  const salvarGastoPlanejado = async () => {
    if (!novoGastoPlanejado.nome || !novoGastoPlanejado.valor_estimado) {
      toast({
        title: '❌ Campos obrigatórios',
        description: 'Preencha nome e valor estimado',
        variant: 'destructive'
      })
      return
    }

    const success = await addGastoPlanejado({
      nome: novoGastoPlanejado.nome,
      valor_estimado: novoGastoPlanejado.valor_estimado,
      data_vencimento: novoGastoPlanejado.data_vencimento || undefined,
      categoria: novoGastoPlanejado.categoria,
      observacoes: novoGastoPlanejado.observacoes,
      pago: false
    })

    if (success) {
      // Reset do formulário
      setNovoGastoPlanejado({
        nome: '',
        valor_estimado: 0,
        data_vencimento: '',
        categoria: 'Outros',
        observacoes: ''
      })
      setShowGastoModal(false)
    }
  }

  // Função para confirmar transação após OCR
  const confirmarTransacao = async () => {
    if (!dadosExtraidos || !dadosExtraidos.valor || !dadosExtraidos.categoria) {
      toast({
        title: '❌ Dados incompletos',
        description: 'Valor e categoria são obrigatórios',
        variant: 'destructive'
      })
      return
    }

    const success = await addTransacao({
      tipo: uploadType!,
      categoria: dadosExtraidos.categoria,
      valor: parseFloat(dadosExtraidos.valor),
      descricao: dadosExtraidos.descricao || '',
      data_transacao: dadosExtraidos.data || new Date().toISOString().split('T')[0],
      metodo_pagamento: dadosExtraidos.metodo_pagamento || '',
      comprovante_url: dadosExtraidos.comprovante_url || '',
      dados_ocr: dadosExtraidos
    })

    if (success) {
      // Reset dos estados
      setShowUploadModal(false)
      setUploadType(null)
      setDadosExtraidos(null)
    }
  }

  // Função para processar upload de arquivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: '❌ Arquivo muito grande',
        description: 'O arquivo deve ter no máximo 10MB',
        variant: 'destructive'
      })
      return
    }

    setProcessandoOCR(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tipo', uploadType || '')

      const response = await fetch('/api/supabase/functions/process-financial-document', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Erro ao processar documento')
      }

      const result = await response.json()
      setDadosExtraidos(result.dados)

      toast({
        title: '✅ Documento processado',
        description: 'Dados extraídos com sucesso! Revise e confirme.',
      })
    } catch (error) {
      console.error('Erro no OCR:', error)
      toast({
        title: '❌ Erro no processamento',
        description: 'Não foi possível extrair os dados do documento.',
        variant: 'destructive'
      })
    } finally {
      setProcessandoOCR(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Loader className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Carregando dados financeiros...</h2>
          <p className="text-gray-600">Aguarde enquanto carregamos suas informações</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            💰 Controle Financeiro
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie receitas, despesas e planejamento financeiro
          </p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">💰 Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totais.receitas.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transacoes.filter(t => t.tipo === 'receita').length} transação(ões)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">💸 Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totais.despesas.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transacoes.filter(t => t.tipo === 'despesa').length} transação(ões)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">💳 Saldo Atual</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totais.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {totais.saldo.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totais.saldo >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🎯 Gastos Planejados</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R$ {totais.gastosPlanejadosTotal.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {gastosPlanejados.filter(g => !g.pago).length} pendente(s)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botões de Ação */}
      <FinancialActionButtons
        onUploadReceita={() => {
          setUploadType('receita')
          setShowUploadModal(true)
        }}
        onUploadDespesa={() => {
          setUploadType('despesa')
          setShowUploadModal(true)
        }}
        onManualReceita={() => {
          setNovaTransacao(prev => ({ ...prev, tipo: 'receita' }))
          setShowManualModal(true)
        }}
        onManualDespesa={() => {
          setNovaTransacao(prev => ({ ...prev, tipo: 'despesa' }))
          setShowManualModal(true)
        }}
        onGastoPlanejado={() => setShowGastoModal(true)}
      />

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visao-geral">📊 Visão Geral</TabsTrigger>
          <TabsTrigger value="receitas">💰 Receitas</TabsTrigger>
          <TabsTrigger value="despesas">💸 Despesas</TabsTrigger>
          <TabsTrigger value="planejamento">🎯 Planejamento</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral">
          <AdvancedCharts {...chartData} />
        </TabsContent>

        <TabsContent value="receitas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                💰 Receitas Registradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Carregando receitas...</p>
                  </div>
                ) : transacoes.filter(t => t.tipo === 'receita').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma receita registrada ainda.</p>
                  </div>
                ) : (
                  transacoes.filter(t => t.tipo === 'receita').map((receita) => (
                    <Card key={receita.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                {receita.categoria}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(receita.data_transacao).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-green-600">
                              R$ {receita.valor.toFixed(2)}
                            </p>
                            {receita.descricao && (
                              <p className="text-sm text-gray-600 mt-1">{receita.descricao}</p>
                            )}
                            {receita.metodo_pagamento && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Receipt className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{receita.metodo_pagamento}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {receita.dados_ocr && (
                              <Badge variant="secondary" className="text-xs">
                                <Camera className="h-3 w-3 mr-1" />
                                OCR
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => receita.id && deleteTransacao(receita.id)}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="despesas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                💸 Despesas Registradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Carregando despesas...</p>
                  </div>
                ) : transacoes.filter(t => t.tipo === 'despesa').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma despesa registrada ainda.</p>
                  </div>
                ) : (
                  transacoes.filter(t => t.tipo === 'despesa').map((despesa) => (
                    <Card key={despesa.id} className="border-l-4 border-l-red-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className="text-red-600 border-red-200">
                                {despesa.categoria}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(despesa.data_transacao).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-red-600">
                              R$ {despesa.valor.toFixed(2)}
                            </p>
                            {despesa.descricao && (
                              <p className="text-sm text-gray-600 mt-1">{despesa.descricao}</p>
                            )}
                            {despesa.metodo_pagamento && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Receipt className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{despesa.metodo_pagamento}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {despesa.dados_ocr && (
                              <Badge variant="secondary" className="text-xs">
                                <Camera className="h-3 w-3 mr-1" />
                                OCR
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => despesa.id && deleteTransacao(despesa.id)}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planejamento">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                🎯 Gastos Planejados
                <Button
                  onClick={() => setShowGastoModal(true)}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Gasto
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Carregando gastos planejados...</p>
                  </div>
                ) : gastosPlanejados.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum gasto planejado ainda.</p>
                  </div>
                ) : (
                  gastosPlanejados.map((gasto) => (
                    <Card key={gasto.id} className={`border-l-4 ${gasto.pago ? 'border-l-green-500' : 'border-l-orange-500'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className={gasto.pago ? 'text-green-600 border-green-200' : 'text-orange-600 border-orange-200'}>
                                {gasto.categoria}
                              </Badge>
                              {gasto.data_vencimento && (
                                <span className="text-sm text-gray-500">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {new Date(gasto.data_vencimento).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                              <Badge variant={gasto.pago ? 'default' : 'secondary'}>
                                {gasto.pago ? '✅ Pago' : '⏰ Pendente'}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-gray-900">{gasto.nome}</h4>
                            <p className={`text-lg font-semibold ${gasto.pago ? 'text-green-600' : 'text-orange-600'}`}>
                              R$ {gasto.valor_estimado.toFixed(2)}
                            </p>
                            {gasto.observacoes && (
                              <p className="text-sm text-gray-600 mt-1">{gasto.observacoes}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant={gasto.pago ? 'secondary' : 'default'}
                              onClick={() => gasto.id && updateGastoPlanejado(gasto.id, { pago: !gasto.pago })}
                            >
                              {gasto.pago ? 'Marcar Pendente' : 'Marcar Pago'}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => gasto.id && deleteGastoPlanejado(gasto.id)}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {uploadType === 'receita' ? '📸 Upload Receita' : '📸 Upload Despesa'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadType(null)
                  setDadosExtraidos(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {dadosExtraidos ? (
              <div>
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">Dados extraídos com sucesso!</p>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Revise e edite se necessário</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                    <input
                      type="number"
                      step="0.01"
                      value={dadosExtraidos.valor || 0}
                      onChange={(e) => setDadosExtraidos((prev: any) => ({ ...prev, valor: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={dadosExtraidos.descricao || ''}
                      onChange={(e) => setDadosExtraidos((prev: any) => ({ ...prev, descricao: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="date"
                      value={dadosExtraidos.data || ''}
                      onChange={(e) => setDadosExtraidos((prev: any) => ({ ...prev, data: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      value={dadosExtraidos.categoria || ''}
                      onChange={(e) => setDadosExtraidos((prev: any) => ({ ...prev, categoria: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      {uploadType === 'receita' ? (
                        <>
                          <option value="Vendas Bolos">Vendas Bolos</option>
                          <option value="Vendas Docinhos">Vendas Docinhos</option>
                          <option value="Vendas Tortas">Vendas Tortas</option>
                          <option value="Encomendas">Encomendas</option>
                        </>
                      ) : (
                        <>
                          <option value="Ingredientes">Ingredientes</option>
                          <option value="Equipamentos">Equipamentos</option>
                          <option value="Embalagens">Embalagens</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Outros">Outros</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setDadosExtraidos(null)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={confirmarTransacao}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Confirmar Transação
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  Faça upload da foto da nota fiscal, comprovante ou extrato para extrair os dados automaticamente com IA.
                </p>

                {processandoOCR ? (
                  <div className="text-center py-8">
                    <Loader className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">🤖 IA processando documento...</p>
                    <p className="text-sm text-gray-500 mt-2">Analisando dados da imagem</p>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">Clique para fazer upload</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG até 10MB</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowUploadModal(false)
                      setUploadType(null)
                      setDadosExtraidos(null)
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Transação Manual */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {novaTransacao.tipo === 'receita' ? '💰 Nova Receita' : '💸 Nova Despesa'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowManualModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <select
                  id="categoria"
                  value={novaTransacao.categoria}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {novaTransacao.tipo === 'receita' ? (
                    <>
                      <option value="Vendas Bolos">Vendas Bolos</option>
                      <option value="Vendas Docinhos">Vendas Docinhos</option>
                      <option value="Vendas Tortas">Vendas Tortas</option>
                      <option value="Encomendas">Encomendas</option>
                    </>
                  ) : (
                    <>
                      <option value="Ingredientes">Ingredientes</option>
                      <option value="Equipamentos">Equipamentos</option>
                      <option value="Embalagens">Embalagens</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Outros">Outros</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <Label htmlFor="valor">Valor *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={novaTransacao.valor}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  type="text"
                  value={novaTransacao.descricao}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva a transação"
                />
              </div>

              <div>
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={novaTransacao.data}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, data: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="metodo_pagamento">Método de Pagamento</Label>
                <select
                  id="metodo_pagamento"
                  value={novaTransacao.metodo_pagamento}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, metodo_pagamento: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="PIX">PIX</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Transferência">Transferência</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowManualModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={salvarTransacaoManual}
                disabled={!novaTransacao.categoria || !novaTransacao.valor || !novaTransacao.data}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Salvar Transação
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gasto Planejado */}
      {showGastoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">🎯 Novo Gasto Planejado</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGastoModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Gasto *</Label>
                <Input
                  id="nome"
                  type="text"
                  value={novoGastoPlanejado.nome}
                  onChange={(e) => setNovoGastoPlanejado(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Ingredientes do mês"
                />
              </div>

              <div>
                <Label htmlFor="valor_estimado">Valor Estimado *</Label>
                <Input
                  id="valor_estimado"
                  type="number"
                  step="0.01"
                  value={novoGastoPlanejado.valor_estimado}
                  onChange={(e) => setNovoGastoPlanejado(prev => ({ ...prev, valor_estimado: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="data_vencimento">Data de Vencimento</Label>
                <Input
                  id="data_vencimento"
                  type="date"
                  value={novoGastoPlanejado.data_vencimento}
                  onChange={(e) => setNovoGastoPlanejado(prev => ({ ...prev, data_vencimento: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="categoria_gasto">Categoria</Label>
                <select
                  id="categoria_gasto"
                  value={novoGastoPlanejado.categoria}
                  onChange={(e) => setNovoGastoPlanejado(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Ingredientes">Ingredientes</option>
                  <option value="Equipamentos">Equipamentos</option>
                  <option value="Embalagens">Embalagens</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  type="text"
                  value={novoGastoPlanejado.observacoes}
                  onChange={(e) => setNovoGastoPlanejado(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Observações adicionais"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowGastoModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={salvarGastoPlanejado}
                disabled={!novoGastoPlanejado.nome || !novoGastoPlanejado.valor_estimado}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Salvar Gasto Planejado
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}