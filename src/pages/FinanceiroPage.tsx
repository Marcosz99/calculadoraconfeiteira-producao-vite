import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, Upload, DollarSign, TrendingUp, TrendingDown, PieChart, 
  Calendar, CheckCircle, AlertCircle, Eye, Trash2, Edit, Plus,
  BarChart3, Users, Package, Clock, Target, Zap, FileText
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { useAuth } from '../contexts/AuthContext'
import { TransacaoFinanceira, GastoFixo, GastoPlanejado, ResumoFinanceiro, Orcamento, Cliente, Receita } from '../types'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import AdvancedCharts from '../components/AdvancedCharts'
import { supabase } from '@/integrations/supabase/client'
import { FinancialActionButtons } from '../components/FinancialActionButtons'

export default function FinanceiroPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Estados principais
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>([])
  const [gastosFixos, setGastosFixos] = useState<GastoFixo[]>([])
  const [gastosPlanejados, setGastosPlanejados] = useState<GastoPlanejado[]>([])
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  
  // Estados para modais
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showManualModal, setShowManualModal] = useState(false)
  const [showGastoFixoModal, setShowGastoFixoModal] = useState(false)
  const [showGastoPlanejadoModal, setShowGastoPlanejadoModal] = useState(false)
  const [uploadType, setUploadType] = useState<'receita' | 'despesa' | null>(null)
  const [processandoOCR, setProcessandoOCR] = useState(false)
  const [dadosExtraidos, setDadosExtraidos] = useState<Partial<TransacaoFinanceira> | null>(null)
  
  // Estados para formulário manual
  const [novaTransacao, setNovaTransacao] = useState<Partial<TransacaoFinanceira>>({
    tipo: 'receita',
    valor: 0,
    data: new Date().toISOString().substring(0, 10),
    categoria: '',
    descricao: '',
    metodo_pagamento: 'pix',
    fornecedor_cliente: '',
    extraido_por_ocr: false,
    verificado: true
  })
  
  // Estados para formulários
  const [novoGastoFixo, setNovoGastoFixo] = useState<Partial<GastoFixo>>({
    nome: '',
    valor: 0,
    categoria: '',
    data_vencimento: '',
    recorrente: true,
    periodicidade: 'mensal'
  })
  
  const [novoGastoPlanejado, setNovoGastoPlanejado] = useState<Partial<GastoPlanejado>>({
    nome: '',
    valor_estimado: 0,
    categoria: '',
    descricao: '',
    data_prevista: '',
    prioridade: 'media'
  })
  
  const [periodoFiltro, setPeriodoFiltro] = useState('30')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar dados do localStorage
  useEffect(() => {
    if (user) {
      // Carregar dados existentes ou criar mock data
      const savedTransacoes = getFromLocalStorage<TransacaoFinanceira[]>('transacoes_financeiras', [])
      const savedGastosFixos = getFromLocalStorage<GastoFixo[]>('gastos_fixos', [])
      const savedGastosPlanejados = getFromLocalStorage<GastoPlanejado[]>('gastos_planejados', [])
      const savedOrcamentos = getFromLocalStorage<Orcamento[]>(LOCAL_STORAGE_KEYS.ORCAMENTOS, [])
      const savedClientes = getFromLocalStorage<Cliente[]>(LOCAL_STORAGE_KEYS.CLIENTES, [])
      const savedReceitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, [])
      
      // Se não há dados, criar mock data
      if (savedTransacoes.length === 0) {
        const mockTransacoes: TransacaoFinanceira[] = [
          {
            id: '1',
            tipo: 'receita',
            valor: 450.00,
            data: '2025-09-15',
            categoria: 'Vendas Bolos',
            descricao: 'Bolo de Chocolate - Cliente Maria',
            metodo_pagamento: 'pix',
            fornecedor_cliente: 'Maria Silva',
            extraido_por_ocr: false,
            verificado: true,
            criado_em: new Date().toISOString()
          },
          {
            id: '2',
            tipo: 'despesa',
            valor: 85.50,
            data: '2025-09-18',
            categoria: 'Ingredientes',
            descricao: 'Chocolate e Farinha - Supermercado',
            metodo_pagamento: 'cartao_debito',
            fornecedor_cliente: 'Super Atacadão',
            extraido_por_ocr: true,
            verificado: true,
            criado_em: new Date().toISOString()
          },
          {
            id: '3',
            tipo: 'receita',
            valor: 120.00,
            data: '2025-09-20',
            categoria: 'Vendas Docinhos',
            descricao: 'Brigadeiros para festa - Cliente Ana',
            metodo_pagamento: 'dinheiro',
            fornecedor_cliente: 'Ana Costa',
            extraido_por_ocr: false,
            verificado: true,
            criado_em: new Date().toISOString()
          }
        ]
        setTransacoes(mockTransacoes)
        saveToLocalStorage('transacoes_financeiras', mockTransacoes)
      } else {
        setTransacoes(savedTransacoes.filter(t => t.id))
      }
      
      if (savedGastosFixos.length === 0) {
        const mockGastosFixos: GastoFixo[] = [
          {
            id: '1',
            usuario_id: user.id,
            nome: 'Aluguel da Cozinha',
            valor: 800.00,
            categoria: 'Estrutura',
            data_vencimento: '05',
            recorrente: true,
            periodicidade: 'mensal',
            ativo: true,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          },
          {
            id: '2',
            usuario_id: user.id,
            nome: 'Energia Elétrica',
            valor: 150.00,
            categoria: 'Utilidades',
            recorrente: true,
            periodicidade: 'mensal',
            ativo: true,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          }
        ]
        setGastosFixos(mockGastosFixos)
        saveToLocalStorage('gastos_fixos', mockGastosFixos)
      } else {
        setGastosFixos(savedGastosFixos.filter(g => g.usuario_id === user.id && g.ativo))
      }
      
      if (savedGastosPlanejados.length === 0) {
        const mockGastosPlanejados: GastoPlanejado[] = [
          {
            id: '1',
            usuario_id: user.id,
            nome: 'Comprar Forno Industrial',
            valor_estimado: 2500.00,
            categoria: 'Equipamentos',
            descricao: 'Forno para aumentar capacidade de produção',
            data_prevista: '2025-11-01',
            prioridade: 'alta',
            status: 'planejado',
            impacto_fluxo_caixa: -2500.00,
            criado_em: new Date().toISOString()
          }
        ]
        setGastosPlanejados(mockGastosPlanejados)
        saveToLocalStorage('gastos_planejados', mockGastosPlanejados)
      } else {
        setGastosPlanejados(savedGastosPlanejados.filter(g => g.usuario_id === user.id))
      }
      
      setOrcamentos(savedOrcamentos.filter(o => o.usuario_id === user.id))
      setClientes(savedClientes.filter(c => c.usuario_id === user.id && c.ativo))
      setReceitas(savedReceitas.filter(r => r.usuario_id === user.id && r.ativo))
    }
  }, [user])

  // Cálculo do resumo financeiro
  const calcularResumo = (): ResumoFinanceiro => {
    const mesAtual = new Date().toISOString().substring(0, 7) // YYYY-MM
    const transacoesMes = transacoes.filter(t => t.data.startsWith(mesAtual))
    
    const receitas = transacoesMes.filter(t => t.tipo === 'receita')
    const despesas = transacoesMes.filter(t => t.tipo === 'despesa')
    
    const receita_total_mes = receitas.reduce((sum, t) => sum + t.valor, 0)
    const despesa_total_mes = despesas.reduce((sum, t) => sum + t.valor, 0)
    
    // Calcular gastos fixos apenas para o mês atual, considerando periodicidade
    const gastos_fixos_mes = gastosFixos.filter(g => g.ativo).reduce((sum, g) => {
      if (!g.recorrente) return sum + g.valor
      
      // Para gastos recorrentes, só incluir se for mensal ou se vence no mês atual
      if (g.periodicidade === 'mensal') return sum + g.valor
      
      // Para outros períodos, verificar se há vencimento no mês atual
      if (g.data_vencimento) {
        const diaVencimento = parseInt(g.data_vencimento)
        const dataAtual = new Date()
        const mesVencimento = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), diaVencimento)
        
        if (mesVencimento.toISOString().substring(0, 7) === mesAtual) {
          switch (g.periodicidade) {
            case 'bimestral':
              return dataAtual.getMonth() % 2 === 0 ? sum + g.valor : sum
            case 'trimestral':
              return dataAtual.getMonth() % 3 === 0 ? sum + g.valor : sum
            case 'semestral':
              return dataAtual.getMonth() % 6 === 0 ? sum + g.valor : sum
            case 'anual':
              return dataAtual.getMonth() === 0 ? sum + g.valor : sum
            default:
              return sum + g.valor
          }
        }
      }
      
      return sum
    }, 0)
    
    const lucro_liquido = receita_total_mes - despesa_total_mes - gastos_fixos_mes
    const margem_real = receita_total_mes > 0 ? (lucro_liquido / receita_total_mes) * 100 : 0
    const gastos_planejados_mes = gastosPlanejados.filter(g => 
      g.status === 'planejado' && g.data_prevista.startsWith(mesAtual)
    ).reduce((sum, g) => sum + g.valor_estimado, 0)

    return {
      receita_total_mes,
      despesa_total_mes,
      gastos_fixos_mes,
      lucro_liquido,
      margem_real,
      transacoes_mes: transacoesMes.length,
      gastos_planejados_mes
    }
  }

  const resumo = calcularResumo()

  // Filtrar orçamentos por período
  const getDataInicio = () => {
    const hoje = new Date()
    const diasAtras = parseInt(periodoFiltro)
    return new Date(hoje.getTime() - diasAtras * 24 * 60 * 60 * 1000)
  }

  const orcamentosFiltrados = orcamentos.filter(o => {
    const dataOrcamento = new Date(o.data_criacao)
    return dataOrcamento >= getDataInicio()
  })

  const orcamentosAprovados = orcamentosFiltrados.filter(o => o.status === 'aprovado')

  // Métricas para relatórios
  const metricas = {
    totalVendas: orcamentosAprovados.reduce((total, o) => total + o.valor_total, 0),
    totalOrcamentos: orcamentosFiltrados.length,
    orcamentosAprovados: orcamentosAprovados.length,
    ticketMedio: orcamentosAprovados.length > 0 ? orcamentosAprovados.reduce((total, o) => total + o.valor_total, 0) / orcamentosAprovados.length : 0,
    taxaAprovacao: orcamentosFiltrados.length > 0 ? (orcamentosAprovados.length / orcamentosFiltrados.length) * 100 : 0
  }

  // Dados para gráficos
  const vendasMensais = [
    { name: 'Jul', vendas: 4500, gastos: 2800, lucro: 1700 },
    { name: 'Ago', vendas: 5200, gastos: 3100, lucro: 2100 },
    { name: 'Set', vendas: resumo.receita_total_mes, gastos: resumo.despesa_total_mes + resumo.gastos_fixos_mes, lucro: resumo.lucro_liquido }
  ]

  const gastosCategoria = [
    { name: 'Ingredientes', value: 1200, color: '#8884d8' },
    { name: 'Gastos Fixos', value: resumo.gastos_fixos_mes, color: '#82ca9d' },
    { name: 'Equipamentos', value: 300, color: '#ffc658' },
    { name: 'Marketing', value: 200, color: '#ff7300' }
  ]

  const receitasPopulares = [
    { name: 'Bolo de Chocolate', value: 15, color: '#8884d8' },
    { name: 'Brigadeiros', value: 12, color: '#82ca9d' },
    { name: 'Torta de Morango', value: 8, color: '#ffc658' }
  ]

  const crescimentoMensal = [
    { name: 'Crescimento', value: 15.5, color: '#00C49F' }
  ]

  // Funções auxiliares
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
  }

  // Processamento OCR
  const processarComprovanteOCR = async (file: File, tipo: 'receita' | 'despesa') => {
    setProcessandoOCR(true)
    setDadosExtraidos(null)

    try {
      console.log('🔍 Processando comprovante com IA...', file.name)
      
      // Preparar FormData para envio do arquivo
      const formData = new FormData()
      formData.append('imageFile', file)
      formData.append('tipo', tipo)

      // Chamar API do Gemini via Supabase Edge Function
      const response = await fetch(`https://dbwbxzbtydeauczfleqx.supabase.co/functions/v1/process-financial-document`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Erro HTTP:', errorText)
        throw new Error('Erro ao processar o documento')
      }

      const data = await response.json()

      if (data.error) {
        console.error('❌ Erro na API:', data.error)
        throw new Error('Erro ao processar o documento')
      }

      console.log('✅ Dados extraídos:', data)

      const dadosExtraidos: Partial<TransacaoFinanceira> = {
        tipo,
        valor: data.valor_total || 0,
        data: data.data || new Date().toISOString().substring(0, 10),
        categoria: data.categoria || (tipo === 'receita' ? 'Vendas' : 'Gastos'),
        descricao: data.descricao || data.empresa_emitente || 'Transação processada por IA',
        metodo_pagamento: data.metodo_pagamento || 'transferencia',
        fornecedor_cliente: data.empresa_emitente || (tipo === 'receita' ? 'Cliente' : 'Fornecedor'),
        extraido_por_ocr: true,
        verificado: false
      }

      setDadosExtraidos(dadosExtraidos)

    } catch (error) {
      console.error('❌ Erro no OCR:', error)
      alert('❌ Erro ao processar comprovante. Verifique se a imagem está legível e tente novamente.')
    } finally {
      setProcessandoOCR(false)
    }
  }

  const confirmarTransacao = () => {
    if (!dadosExtraidos) return

    const novaTransacao: TransacaoFinanceira = {
      ...dadosExtraidos as TransacaoFinanceira,
      id: Date.now().toString(),
      criado_em: new Date().toISOString()
    }

    const novasTransacoes = [novaTransacao, ...transacoes]
    setTransacoes(novasTransacoes)
    saveToLocalStorage('transacoes_financeiras', novasTransacoes)
    setDadosExtraidos(null)
    setShowUploadModal(false)
    setUploadType(null)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && uploadType) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('❌ Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc)')
        return
      }
      
      // Verificar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('❌ Arquivo muito grande. Máximo 10MB')
        return
      }
      
      await processarComprovanteOCR(file, uploadType)
    }
  }

  // Salvar transação manual
  const salvarTransacaoManual = () => {
    if (!user || !novaTransacao.valor || !novaTransacao.categoria || !novaTransacao.descricao) return

    const transacao: TransacaoFinanceira = {
      ...novaTransacao as TransacaoFinanceira,
      id: Date.now().toString(),
      criado_em: new Date().toISOString()
    }

    const novasTransacoes = [transacao, ...transacoes]
    setTransacoes(novasTransacoes)
    saveToLocalStorage('transacoes_financeiras', novasTransacoes)
    
    // Reset form
    setNovaTransacao({
      tipo: 'receita',
      valor: 0,
      data: new Date().toISOString().substring(0, 10),
      categoria: '',
      descricao: '',
      metodo_pagamento: 'pix',
      fornecedor_cliente: '',
      extraido_por_ocr: false,
      verificado: true
    })
    setShowManualModal(false)
  }

  // Salvar gasto fixo
  const salvarGastoFixo = () => {
    if (!user || !novoGastoFixo.nome || !novoGastoFixo.valor || !novoGastoFixo.categoria) return

    const gastoFixo: GastoFixo = {
      ...novoGastoFixo as GastoFixo,
      id: Date.now().toString(),
      usuario_id: user.id,
      ativo: true,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    }

    const novosGastosFixos = [...gastosFixos, gastoFixo]
    setGastosFixos(novosGastosFixos)
    saveToLocalStorage('gastos_fixos', novosGastosFixos)
    setNovoGastoFixo({
      nome: '',
      valor: 0,
      categoria: '',
      data_vencimento: '',
      recorrente: true,
      periodicidade: 'mensal'
    })
    setShowGastoFixoModal(false)
  }

  // Salvar gasto planejado
  const salvarGastoPlanejado = () => {
    if (!user || !novoGastoPlanejado.nome || !novoGastoPlanejado.valor_estimado) return

    const gastoPlanejado: GastoPlanejado = {
      ...novoGastoPlanejado as GastoPlanejado,
      id: Date.now().toString(),
      usuario_id: user.id,
      status: 'planejado',
      impacto_fluxo_caixa: -(novoGastoPlanejado.valor_estimado || 0),
      criado_em: new Date().toISOString()
    }

    const novosGastosPlanejados = [...gastosPlanejados, gastoPlanejado]
    setGastosPlanejados(novosGastosPlanejados)
    saveToLocalStorage('gastos_planejados', novosGastosPlanejados)
    setNovoGastoPlanejado({
      nome: '',
      valor_estimado: 0,
      categoria: '',
      descricao: '',
      data_prevista: '',
      prioridade: 'media'
    })
    setShowGastoPlanejadoModal(false)
  }

  // Excluir gasto fixo
  const excluirGastoFixo = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este gasto fixo?')) {
      const gastosAtualizados = gastosFixos.map(g => 
        g.id === id ? { ...g, ativo: false, atualizado_em: new Date().toISOString() } : g
      )
      setGastosFixos(gastosAtualizados.filter(g => g.ativo))
      saveToLocalStorage('gastos_fixos', gastosAtualizados)
    }
  }

  // Excluir gasto planejado
  const excluirGastoPlanejado = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este gasto planejado?')) {
      const gastosAtualizados = gastosPlanejados.filter(g => g.id !== id)
      setGastosPlanejados(gastosAtualizados)
      saveToLocalStorage('gastos_planejados', gastosAtualizados)
    }
  }

  // Executar gasto planejado
  const executarGastoPlanejado = (id: string) => {
    if (confirm('Deseja marcar este gasto como executado? Isso irá impactar o cálculo do lucro líquido.')) {
      const gastosAtualizados = gastosPlanejados.map(g => 
        g.id === id ? { ...g, status: 'executado' as const, executado_em: new Date().toISOString() } : g
      )
      setGastosPlanejados(gastosAtualizados)
      saveToLocalStorage('gastos_planejados', gastosAtualizados)
    }
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
              <h1 className="text-2xl font-bold text-gray-900">💰 Financeiro</h1>
            </div>
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
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="reports">Relatórios & Analytics</TabsTrigger>
            <TabsTrigger value="fixed-expenses">Gastos Fixos</TabsTrigger>
            <TabsTrigger value="expense-planning">Planejamento de Gastos</TabsTrigger>
          </TabsList>

          {/* Aba Visão Geral */}
          <TabsContent value="overview" className="space-y-8">
            {/* Cards Principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Receita Total Mês</p>
                    <p className="text-2xl font-bold text-green-600">{formatarMoeda(resumo.receita_total_mes)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Despesas Total Mês</p>
                    <p className="text-2xl font-bold text-red-600">{formatarMoeda(resumo.despesa_total_mes + resumo.gastos_fixos_mes)}</p>
                    <p className="text-xs text-gray-500">Inclui gastos fixos</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Lucro Líquido</p>
                    <p className={`text-2xl font-bold ${resumo.lucro_liquido >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatarMoeda(resumo.lucro_liquido)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Margem Real</p>
                    <p className={`text-2xl font-bold ${resumo.margem_real >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                      {resumo.margem_real.toFixed(1)}%
                    </p>
                  </div>
                  <PieChart className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Insights Financeiros */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">📊 Insights Financeiros</h2>
              <div className="space-y-3">
                {resumo.margem_real > 30 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm">
                      🎉 <strong>Excelente margem!</strong> Sua margem real de {resumo.margem_real.toFixed(1)}% está acima da média do setor.
                    </p>
                  </div>
                )}
                {resumo.margem_real < 15 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ <strong>Margem baixa:</strong> {resumo.margem_real.toFixed(1)}%. Considere revisar seus preços ou reduzir custos.
                    </p>
                  </div>
                )}
                {resumo.lucro_liquido < 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">
                      ❌ <strong>Prejuízo no mês:</strong> {formatarMoeda(Math.abs(resumo.lucro_liquido))}. Analise suas despesas urgentemente.
                    </p>
                  </div>
                )}
                {resumo.gastos_fixos_mes > resumo.receita_total_mes * 0.4 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-orange-800 text-sm">
                      ⚠️ <strong>Gastos fixos altos:</strong> {formatarMoeda(resumo.gastos_fixos_mes)} representam {((resumo.gastos_fixos_mes / resumo.receita_total_mes) * 100).toFixed(1)}% da receita.
                    </p>
                  </div>
                )}
                {resumo.gastos_planejados_mes > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm">
                      📋 <strong>Gastos planejados:</strong> {formatarMoeda(resumo.gastos_planejados_mes)} previstos para este mês.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Transações Recentes */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">📋 Transações Recentes</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Data</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Tipo</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Descrição</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Categoria</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Valor</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transacoes.slice(0, 10).map((transacao) => (
                      <tr key={transacao.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatarData(transacao.data)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transacao.tipo === 'receita' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transacao.tipo === 'receita' ? (
                              <><TrendingUp className="h-3 w-3 mr-1" /> Receita</>
                            ) : (
                              <><TrendingDown className="h-3 w-3 mr-1" /> Despesa</>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>
                            <p className="font-medium">{transacao.descricao}</p>
                            {transacao.fornecedor_cliente && (
                              <p className="text-gray-500 text-xs">{transacao.fornecedor_cliente}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                            {transacao.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <span className={
                            transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                          }>
                            {transacao.tipo === 'receita' ? '+' : '-'} {formatarMoeda(transacao.valor)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center space-x-2">
                            {transacao.verificado ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                            )}
                            {transacao.extraido_por_ocr && (
                              <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">IA</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Aba Relatórios & Analytics */}
          <TabsContent value="reports" className="space-y-8">
            {/* Filtro de período */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">📊 Relatórios & Analytics</h2>
                <select
                  value={periodoFiltro}
                  onChange={(e) => setPeriodoFiltro(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                  <option value="365">Último ano</option>
                </select>
              </div>

              {/* Métricas principais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Total de Vendas</p>
                      <p className="text-2xl font-bold text-blue-700">{formatarMoeda(metricas.totalVendas)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Ticket Médio</p>
                      <p className="text-2xl font-bold text-green-700">{formatarMoeda(metricas.ticketMedio)}</p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">Taxa de Aprovação</p>
                      <p className="text-2xl font-bold text-purple-700">{metricas.taxaAprovacao.toFixed(1)}%</p>
                    </div>
                    <Zap className="h-8 w-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">Total Orçamentos</p>
                      <p className="text-2xl font-bold text-orange-700">{metricas.totalOrcamentos}</p>
                    </div>
                    <FileText className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos Avançados */}
            <AdvancedCharts
              vendasMensais={vendasMensais}
              gastosCategoria={gastosCategoria}
              receitasPopulares={receitasPopulares}
              crescimentoMensal={crescimentoMensal}
            />

            {/* Produtos mais vendidos */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">🏆 Produtos Mais Vendidos</h3>
              <div className="space-y-3">
                {receitasPopulares.map((produto, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 mr-3">#{index + 1}</span>
                      <span className="font-medium">{produto.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{produto.value} vendas</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clientes mais valiosos */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">👑 Clientes Mais Valiosos</h3>
              <div className="space-y-3">
                {clientes.slice(0, 5).map((cliente) => (
                  <div key={cliente.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="font-medium">{cliente.nome}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatarMoeda(cliente.valor_total_gasto)}</p>
                      <p className="text-sm text-gray-500">{cliente.historico_pedidos} pedidos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Aba Gastos Fixos */}
          <TabsContent value="fixed-expenses" className="space-y-8">
            {/* Card total gastos fixos */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">💳 Gastos Fixos Mensais</h2>
                  <p className="text-3xl font-bold text-red-600 mt-2">{formatarMoeda(resumo.gastos_fixos_mes)}</p>
                  <p className="text-sm text-gray-600 mt-1">{gastosFixos.length} gastos cadastrados</p>
                </div>
                <button
                  onClick={() => setShowGastoFixoModal(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Gasto Fixo
                </button>
              </div>
            </div>

            {/* Tabela de gastos fixos */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">📋 Gastos Fixos Cadastrados</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Nome</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Categoria</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Valor</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Vencimento</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Recorrência</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {gastosFixos.map((gasto) => (
                      <tr key={gasto.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {gasto.nome}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                            {gasto.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-red-600">
                          {formatarMoeda(gasto.valor)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {gasto.data_vencimento ? `Dia ${gasto.data_vencimento}` : 'Não definido'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            gasto.recorrente ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {gasto.recorrente ? `${gasto.periodicidade}` : 'Único'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => excluirGastoFixo(gasto.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Aba Planejamento de Gastos */}
          <TabsContent value="expense-planning" className="space-y-8">
            {/* Card total gastos planejados */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">📈 Planejamento de Gastos</h2>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{formatarMoeda(resumo.gastos_planejados_mes)}</p>
                  <p className="text-sm text-gray-600 mt-1">{gastosPlanejados.filter(g => g.status === 'planejado').length} gastos planejados</p>
                </div>
                <button
                  onClick={() => setShowGastoPlanejadoModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Gasto Planejado
                </button>
              </div>
            </div>

            {/* Impacto no fluxo de caixa */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Gastos Planejados</p>
                    <p className="text-xl font-bold text-blue-700">
                      {gastosPlanejados.filter(g => g.status === 'planejado').length}
                    </p>
                  </div>
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Gastos Executados</p>
                    <p className="text-xl font-bold text-green-700">
                      {gastosPlanejados.filter(g => g.status === 'executado').length}
                    </p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">Impacto no Fluxo</p>
                    <p className="text-xl font-bold text-red-700">
                      {formatarMoeda(gastosPlanejados.reduce((sum, g) => sum + g.impacto_fluxo_caixa, 0))}
                    </p>
                  </div>
                  <TrendingDown className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </div>

            {/* Tabela de gastos planejados */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">📋 Gastos Planejados</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Nome</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Categoria</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Valor Estimado</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Data Prevista</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Prioridade</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {gastosPlanejados.map((gasto) => (
                      <tr key={gasto.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <div>
                            <p>{gasto.nome}</p>
                            {gasto.descricao && (
                              <p className="text-xs text-gray-500">{gasto.descricao}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                            {gasto.categoria}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                          {formatarMoeda(gasto.valor_estimado)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatarData(gasto.data_prevista)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            gasto.prioridade === 'urgente' ? 'bg-red-100 text-red-800' :
                            gasto.prioridade === 'alta' ? 'bg-orange-100 text-orange-800' :
                            gasto.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {gasto.prioridade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            gasto.status === 'executado' ? 'bg-green-100 text-green-800' :
                            gasto.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {gasto.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center space-x-2">
                            {gasto.status === 'planejado' && (
                              <button 
                                onClick={() => executarGastoPlanejado(gasto.id)}
                                className="text-green-500 hover:text-green-600"
                                title="Executar gasto"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            <button className="text-gray-400 hover:text-gray-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => excluirGastoPlanejado(gasto.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Upload de Comprovante */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {uploadType === 'receita' ? '💰 Adicionar Receita' : '💸 Adicionar Despesa'}
            </h3>

            {dadosExtraidos ? (
              <div>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ Dados extraídos da nota fiscal:</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Valor:</strong> {formatarMoeda(dadosExtraidos.valor || 0)}</div>
                    <div><strong>Data:</strong> {dadosExtraidos.data ? formatarData(dadosExtraidos.data) : 'Não identificada'}</div>
                    <div><strong>Empresa:</strong> {dadosExtraidos.fornecedor_cliente || 'Não identificada'}</div>
                    <div><strong>Categoria:</strong> {dadosExtraidos.categoria || 'Outros'}</div>
                    <div><strong>Descrição:</strong> {dadosExtraidos.descricao || 'Sem descrição'}</div>
                    <div><strong>Pagamento:</strong> {dadosExtraidos.metodo_pagamento || 'Não identificado'}</div>
                  </div>
                </div>

                {/* Formulário para editar dados extraídos */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                    <input
                      type="number"
                      step="0.01"
                      value={dadosExtraidos.valor || 0}
                      onChange={(e) => setDadosExtraidos(prev => prev ? { ...prev, valor: parseFloat(e.target.value) } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="date"
                      value={dadosExtraidos.data || ''}
                      onChange={(e) => setDadosExtraidos(prev => prev ? { ...prev, data: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      value={dadosExtraidos.categoria || ''}
                      onChange={(e) => setDadosExtraidos(prev => prev ? { ...prev, categoria: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione uma categoria</option>
                      {uploadType === 'receita' ? (
                        <>
                          <option value="Vendas Bolos">Vendas Bolos</option>
                          <option value="Vendas Docinhos">Vendas Docinhos</option>
                          <option value="Vendas Tortas">Vendas Tortas</option>
                          <option value="Encomendas">Encomendas</option>
                          <option value="Outros">Outros</option>
                        </>
                      ) : (
                        <>
                          <option value="Ingredientes">Ingredientes</option>
                          <option value="Embalagens">Embalagens</option>
                          <option value="Equipamentos">Equipamentos</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Contas">Contas</option>
                          <option value="Outros">Outros</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={dadosExtraidos.descricao || ''}
                      onChange={(e) => setDadosExtraidos(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Descreva a transação"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa/Cliente</label>
                    <input
                      type="text"
                      value={dadosExtraidos.fornecedor_cliente || ''}
                      onChange={(e) => setDadosExtraidos(prev => prev ? { ...prev, fornecedor_cliente: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome da empresa ou cliente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pagamento</label>
                    <select
                      value={dadosExtraidos.metodo_pagamento || 'pix'}
                      onChange={(e) => setDadosExtraidos(prev => prev ? { ...prev, metodo_pagamento: e.target.value as any } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pix">PIX</option>
                      <option value="dinheiro">Dinheiro</option>
                      <option value="cartao_credito">Cartão de Crédito</option>
                      <option value="cartao_debito">Cartão de Débito</option>
                      <option value="transferencia">Transferência</option>
                    </select>
                  </div>
                </div>

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
                  <button
                    onClick={confirmarTransacao}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    ✅ Confirmar Transação
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                    <input
                      type="number"
                      step="0.01"
                      value={dadosExtraidos.valor || 0}
                      onChange={(e) => setDadosExtraidos(prev => ({ ...prev, valor: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={dadosExtraidos.descricao || ''}
                      onChange={(e) => setDadosExtraidos(prev => ({ ...prev, descricao: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="date"
                      value={dadosExtraidos.data || ''}
                      onChange={(e) => setDadosExtraidos(prev => ({ ...prev, data: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      value={dadosExtraidos.categoria || ''}
                      onChange={(e) => setDadosExtraidos(prev => ({ ...prev, categoria: e.target.value }))}
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
            )}
          </div>
        </div>
      )}

      {/* Modal de Transação Manual */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {novaTransacao.tipo === 'receita' ? '💰 Nova Receita' : '💸 Nova Despesa'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
                <input
                  type="number"
                  step="0.01"
                  value={novaTransacao.valor || 0}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, valor: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                <input
                  type="date"
                  value={novaTransacao.data || ''}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, data: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <select
                  value={novaTransacao.categoria || ''}
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
                      <option value="Outros">Outros</option>
                    </>
                  ) : (
                    <>
                      <option value="Ingredientes">Ingredientes</option>
                      <option value="Embalagens">Embalagens</option>
                      <option value="Equipamentos">Equipamentos</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Contas">Contas</option>
                      <option value="Outros">Outros</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                <input
                  type="text"
                  value={novaTransacao.descricao || ''}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, descricao: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva a transação"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {novaTransacao.tipo === 'receita' ? 'Cliente' : 'Fornecedor'}
                </label>
                <input
                  type="text"
                  value={novaTransacao.fornecedor_cliente || ''}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, fornecedor_cliente: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={novaTransacao.tipo === 'receita' ? 'Nome do cliente' : 'Nome do fornecedor'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pagamento</label>
                <select
                  value={novaTransacao.metodo_pagamento || 'pix'}
                  onChange={(e) => setNovaTransacao(prev => ({ ...prev, metodo_pagamento: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pix">PIX</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowManualModal(false)
                  setNovaTransacao({
                    tipo: 'receita',
                    valor: 0,
                    data: new Date().toISOString().substring(0, 10),
                    categoria: '',
                    descricao: '',
                    metodo_pagamento: 'pix',
                    fornecedor_cliente: '',
                    extraido_por_ocr: false,
                    verificado: true
                  })
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarTransacaoManual}
                disabled={!novaTransacao.valor || !novaTransacao.categoria || !novaTransacao.descricao}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 Salvar Transação
              </button>
            </div>
          </div>
        </div>
      )}
      {showGastoFixoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">💳 Novo Gasto Fixo</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={novoGastoFixo.nome || ''}
                  onChange={(e) => setNovoGastoFixo(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Aluguel da cozinha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  value={novoGastoFixo.valor || 0}
                  onChange={(e) => setNovoGastoFixo(prev => ({ ...prev, valor: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={novoGastoFixo.categoria || ''}
                  onChange={(e) => setNovoGastoFixo(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Estrutura">Estrutura</option>
                  <option value="Utilidades">Utilidades</option>
                  <option value="Equipamentos">Equipamentos</option>
                  <option value="Serviços">Serviços</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento (opcional)</label>
                <input
                  type="text"
                  value={novoGastoFixo.data_vencimento || ''}
                  onChange={(e) => setNovoGastoFixo(prev => ({ ...prev, data_vencimento: e.target.value }))}
                  placeholder="Ex: 05 (dia do mês)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="recorrente"
                  checked={novoGastoFixo.recorrente || false}
                  onChange={(e) => setNovoGastoFixo(prev => ({ ...prev, recorrente: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="recorrente" className="text-sm font-medium text-gray-700">
                  Gasto recorrente
                </label>
              </div>

              {novoGastoFixo.recorrente && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Periodicidade</label>
                  <select
                    value={novoGastoFixo.periodicidade || 'mensal'}
                    onChange={(e) => setNovoGastoFixo(prev => ({ ...prev, periodicidade: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="mensal">Mensal</option>
                    <option value="bimestral">Bimestral</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowGastoFixoModal(false)
                  setNovoGastoFixo({
                    nome: '',
                    valor: 0,
                    categoria: '',
                    data_vencimento: '',
                    recorrente: true,
                    periodicidade: 'mensal'
                  })
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarGastoFixo}
                disabled={!novoGastoFixo.nome || !novoGastoFixo.valor || !novoGastoFixo.categoria}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar Gasto Fixo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Gasto Planejado */}
      {showGastoPlanejadoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">📈 Novo Gasto Planejado</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={novoGastoPlanejado.nome || ''}
                  onChange={(e) => setNovoGastoPlanejado(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Comprar forno industrial"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado</label>
                <input
                  type="number"
                  step="0.01"
                  value={novoGastoPlanejado.valor_estimado || 0}
                  onChange={(e) => setNovoGastoPlanejado(prev => ({ ...prev, valor_estimado: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={novoGastoPlanejado.categoria || ''}
                  onChange={(e) => setNovoGastoPlanejado(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Equipamentos">Equipamentos</option>
                  <option value="Reformas">Reformas</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Expansão">Expansão</option>
                  <option value="Capacitação">Capacitação</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                <textarea
                  value={novoGastoPlanejado.descricao || ''}
                  onChange={(e) => setNovoGastoPlanejado(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva o objetivo deste gasto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Prevista</label>
                <input
                  type="date"
                  value={novoGastoPlanejado.data_prevista || ''}
                  onChange={(e) => setNovoGastoPlanejado(prev => ({ ...prev, data_prevista: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                <select
                  value={novoGastoPlanejado.prioridade || 'media'}
                  onChange={(e) => setNovoGastoPlanejado(prev => ({ ...prev, prioridade: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowGastoPlanejadoModal(false)
                  setNovoGastoPlanejado({
                    nome: '',
                    valor_estimado: 0,
                    categoria: '',
                    descricao: '',
                    data_prevista: '',
                    prioridade: 'media'
                  })
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarGastoPlanejado}
                disabled={!novoGastoPlanejado.nome || !novoGastoPlanejado.valor_estimado}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar Gasto Planejado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}