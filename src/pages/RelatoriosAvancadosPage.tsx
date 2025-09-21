import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, DollarSign, Package, Users, Calendar, Download, BarChart3, FileText, Upload } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Orcamento, Cliente, Receita } from '../types'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../utils/localStorage'
import DocumentManager, { StoredDocument } from '../components/DocumentManager'
import AdvancedCharts from '../components/AdvancedCharts'
import { analyzeBusinessExpenses } from '../services/geminiService'

export default function RelatoriosAvancadosPage() {
  const { user } = useAuth()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [documentos, setDocumentos] = useState<StoredDocument[]>([])
  const [periodoFiltro, setPeriodoFiltro] = useState('30') // 30 dias
  const [activeTab, setActiveTab] = useState<'overview' | 'documentos' | 'insights'>('overview')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [businessInsights, setBusinessInsights] = useState<any>(null)

  useEffect(() => {
    if (user) {
      const savedOrcamentos = getFromLocalStorage<Orcamento[]>(LOCAL_STORAGE_KEYS.ORCAMENTOS, [])
      const savedClientes = getFromLocalStorage<Cliente[]>(LOCAL_STORAGE_KEYS.CLIENTES, [])
      const savedReceitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, [])
      const savedDocumentos = getFromLocalStorage<StoredDocument[]>(LOCAL_STORAGE_KEYS.DOCUMENTOS_FISCAIS, [])
      
      setOrcamentos(savedOrcamentos.filter(o => o.usuario_id === user.id))
      setClientes(savedClientes.filter(c => c.usuario_id === user.id && c.ativo))
      setReceitas(savedReceitas.filter(r => r.usuario_id === user.id && r.ativo))
      setDocumentos(savedDocumentos.filter(d => d.usuario_id === user.id))
    }
  }, [user])

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

  // Métricas principais
  const metricas = {
    totalVendas: orcamentosAprovados.reduce((total, o) => total + o.valor_total, 0),
    totalOrcamentos: orcamentosFiltrados.length,
    orcamentosAprovados: orcamentosAprovados.length,
    taxaAprovacao: orcamentosFiltrados.length > 0 
      ? (orcamentosAprovados.length / orcamentosFiltrados.length) * 100 
      : 0,
    ticketMedio: orcamentosAprovados.length > 0 
      ? orcamentosAprovados.reduce((total, o) => total + o.valor_total, 0) / orcamentosAprovados.length 
      : 0,
    clientesAtivos: new Set(orcamentosAprovados.map(o => o.cliente_id)).size,
    totalGastos: documentos.reduce((total, doc) => total + doc.valor_total, 0)
  }

  // Produtos mais vendidos
  const produtosMaisVendidos = () => {
    const contadorProdutos: { [key: string]: { nome: string, quantidade: number, valor: number } } = {}
    
    orcamentosAprovados.forEach(orcamento => {
      orcamento.itens.forEach(item => {
        const receita = receitas.find(r => r.id === item.receita_id)
        if (receita) {
          if (!contadorProdutos[item.receita_id]) {
            contadorProdutos[item.receita_id] = {
              nome: receita.nome,
              quantidade: 0,
              valor: 0
            }
          }
          contadorProdutos[item.receita_id].quantidade += item.quantidade
          contadorProdutos[item.receita_id].valor += item.valor_total
        }
      })
    })

    return Object.values(contadorProdutos)
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5)
  }

  // Analisar documentos fiscais
  const handleAnalyzeDocuments = async () => {
    if (documentos.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeBusinessExpenses(documentos);
      setBusinessInsights(analysis);
    } catch (error) {
      console.error('Erro ao analisar documentos:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Preparar dados para gráficos
  const prepareChartData = () => {
    // Dados mensais com base nos orçamentos e documentos
    const today = new Date()
    const vendasMensais: { name: string; vendas: number; gastos: number; lucro: number }[] = []
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = month.toLocaleDateString('pt-BR', { month: 'short' })
      
      const vendasMes = orcamentosAprovados
        .filter(o => {
          const dataOrcamento = new Date(o.data_criacao)
          return dataOrcamento.getMonth() === month.getMonth() && 
                 dataOrcamento.getFullYear() === month.getFullYear()
        })
        .reduce((total, o) => total + o.valor_total, 0)
      
      const gastosMes = documentos
        .filter(d => {
          const dataDoc = new Date(d.data)
          return dataDoc.getMonth() === month.getMonth() && 
                 dataDoc.getFullYear() === month.getFullYear()
        })
        .reduce((total, d) => total + d.valor_total, 0)
      
      vendasMensais.push({
        name: monthName,
        vendas: vendasMes,
        gastos: gastosMes,
        lucro: vendasMes - gastosMes
      })
    }

    const gastosCategoria = businessInsights ? 
      Object.entries(businessInsights.gastos_por_categoria).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
        value: value as number
      })) : [
      { name: 'Ingredientes', value: metricas.totalGastos * 0.4 },
      { name: 'Embalagens', value: metricas.totalGastos * 0.2 },
      { name: 'Marketing', value: metricas.totalGastos * 0.15 },
      { name: 'Equipamentos', value: metricas.totalGastos * 0.15 },
      { name: 'Outros', value: metricas.totalGastos * 0.1 }
    ];

    const receitasPopulares = produtosMaisVendidos().map(produto => ({
      name: produto.nome.length > 15 ? produto.nome.substring(0, 15) + '...' : produto.nome,
      value: produto.valor
    }));

    const crescimentoMensal = vendasMensais.map((data, index) => {
      if (index === 0) return { name: data.name, value: 0 }
      const anterior = vendasMensais[index - 1]
      const crescimento = anterior.vendas > 0 
        ? ((data.vendas - anterior.vendas) / anterior.vendas) * 100
        : 0
      return { name: data.name, value: Math.round(crescimento) }
    }).slice(1);

    return { vendasMensais, gastosCategoria, receitasPopulares, crescimentoMensal };
  };

  const chartData = prepareChartData();

  const exportarRelatorio = () => {
    const dados = {
      periodo: `${periodoFiltro} dias`,
      dataGeracao: new Date().toLocaleDateString('pt-BR'),
      metricas,
      produtosMaisVendidos: produtosMaisVendidos(),
      documentosAnalisados: documentos.length,
      totalGastos: metricas.totalGastos,
      insights: businessInsights
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dados, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `relatorio-avancado-${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
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
                Relatórios Avançados
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Análise completa com documentos fiscais e IA
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
            </select>
            
            {documentos.length > 0 && (
              <button
                onClick={handleAnalyzeDocuments}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BarChart3 className="h-5 w-5" />
                <span>{isAnalyzing ? 'Analisando...' : 'Analisar IA'}</span>
              </button>
            )}
            
            <button
              onClick={exportarRelatorio}
              className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 text-center py-2 px-4 rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Visão Geral</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`flex-1 text-center py-2 px-4 rounded-md transition-colors ${
              activeTab === 'documentos'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documentos Fiscais</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 text-center py-2 px-4 rounded-md transition-colors ${
              activeTab === 'insights'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Gráficos Avançados</span>
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Métricas Principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {metricas.totalVendas.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {orcamentosAprovados.length} orçamentos aprovados
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Gastos</p>
                    <p className="text-2xl font-bold text-red-600">
                      R$ {metricas.totalGastos.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {documentos.length} documentos analisados
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-red-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Margem de Lucro</p>
                    <p className="text-2xl font-bold text-blue-600">
                      R$ {(metricas.totalVendas - metricas.totalGastos).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {metricas.totalVendas > 0 ? ((metricas.totalVendas - metricas.totalGastos) / metricas.totalVendas * 100).toFixed(1) : 0}% de margem
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {metricas.taxaAprovacao.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {metricas.orcamentosAprovados} de {metricas.totalOrcamentos} orçamentos
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumo Executivo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Principais Indicadores</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>{orcamentosAprovados.length}</strong> vendas realizadas no período</li>
                    <li>• <strong>{documentos.length}</strong> documentos fiscais processados</li>
                    <li>• <strong>R$ {metricas.ticketMedio.toFixed(2)}</strong> ticket médio por venda</li>
                    <li>• <strong>{metricas.clientesAtivos}</strong> clientes ativos no período</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Status Financeiro</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Receitas:</span>
                      <span className="font-medium text-green-600">R$ {metricas.totalVendas.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gastos:</span>
                      <span className="font-medium text-red-600">R$ {metricas.totalGastos.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>Resultado:</span>
                        <span className={`${metricas.totalVendas >= metricas.totalGastos ? 'text-green-600' : 'text-red-600'}`}>
                          R$ {(metricas.totalVendas - metricas.totalGastos).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documentos' && (
          <div>
            <DocumentManager 
              userId={user?.id || ''} 
              onDocumentsChange={setDocumentos}
            />
            
            {businessInsights && (
              <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Análise de Gastos com IA
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Tendências Identificadas</h4>
                    <ul className="space-y-2">
                      {businessInsights.tendencias.map((tendencia: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{tendencia}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Recomendações</h4>
                    <ul className="space-y-2">
                      {businessInsights.recomendacoes.map((recomendacao: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{recomendacao}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Total de Gastos Analisados:</strong> {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(businessInsights.total_gastos)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div>
            <AdvancedCharts {...chartData} />
          </div>
        )}
      </div>
    </div>
  )
}