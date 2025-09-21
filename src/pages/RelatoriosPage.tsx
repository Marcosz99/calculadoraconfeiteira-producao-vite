import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, DollarSign, Package, Users, Calendar, Download, BarChart3, Upload, FileText, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Orcamento, Cliente, Receita } from '../types'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../utils/localStorage'
import DocumentManager, { StoredDocument } from '../components/DocumentManager'
import AdvancedCharts from '../components/AdvancedCharts'
import { analyzeBusinessExpenses } from '../services/geminiService'

export default function RelatoriosPage() {
  const { user } = useAuth()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [documentos, setDocumentos] = useState<StoredDocument[]>([])
  const [periodoFiltro, setPeriodoFiltro] = useState('30') // 30 dias
  const [activeTab, setActiveTab] = useState('overview')
  const [showDocumentManager, setShowDocumentManager] = useState(false)
  const [analiseDespesas, setAnaliseDespesas] = useState<any>(null)

  useEffect(() => {
    if (user) {
      const savedOrcamentos = getFromLocalStorage<Orcamento[]>(LOCAL_STORAGE_KEYS.ORCAMENTOS, [])
      const savedClientes = getFromLocalStorage<Cliente[]>(LOCAL_STORAGE_KEYS.CLIENTES, [])
      const savedReceitas = getFromLocalStorage<Receita[]>(LOCAL_STORAGE_KEYS.RECEITAS, [])
      
      setOrcamentos(savedOrcamentos.filter(o => o.usuario_id === user.id))
      setClientes(savedClientes.filter(c => c.usuario_id === user.id && c.ativo))
      setReceitas(savedReceitas.filter(r => r.usuario_id === user.id && r.ativo))
    }
  }, [user])

  // Analisar despesas quando documentos mudam
  useEffect(() => {
    if (documentos.length > 0) {
      analyzeBusinessExpenses(documentos)
        .then(analise => setAnaliseDespesas(analise))
        .catch(console.error)
    }
  }, [documentos])

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
    totalGastos: documentos.reduce((total, d) => total + d.valor_total, 0),
    totalOrcamentos: orcamentosFiltrados.length,
    orcamentosAprovados: orcamentosAprovados.length,
    taxaAprovacao: orcamentosFiltrados.length > 0 
      ? (orcamentosAprovados.length / orcamentosFiltrados.length) * 100 
      : 0,
    ticketMedio: orcamentosAprovados.length > 0 
      ? orcamentosAprovados.reduce((total, o) => total + o.valor_total, 0) / orcamentosAprovados.length 
      : 0,
    clientesAtivos: new Set(orcamentosAprovados.map(o => o.cliente_id)).size,
    lucroLiquido: orcamentosAprovados.reduce((total, o) => total + o.valor_total, 0) - documentos.reduce((total, d) => total + d.valor_total, 0)
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

  // Clientes mais valiosos
  const clientesMaisValiosos = () => {
    const contadorClientes: { [key: string]: { nome: string, valor: number, pedidos: number } } = {}
    
    orcamentosAprovados.forEach(orcamento => {
      const cliente = clientes.find(c => c.id === orcamento.cliente_id)
      if (cliente) {
        if (!contadorClientes[orcamento.cliente_id]) {
          contadorClientes[orcamento.cliente_id] = {
            nome: cliente.nome,
            valor: 0,
            pedidos: 0
          }
        }
        contadorClientes[orcamento.cliente_id].valor += orcamento.valor_total
        contadorClientes[orcamento.cliente_id].pedidos += 1
      }
    })

    return Object.values(contadorClientes)
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5)
  }

  // Preparar dados para gráficos
  const prepareChartData = () => {
    const vendasMensais = []
    const today = new Date()
    
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

    const gastosCategoria = analiseDespesas?.gastos_por_categoria ? 
      Object.entries(analiseDespesas.gastos_por_categoria).map(([categoria, valor]) => ({
        name: categoria,
        value: valor as number
      })) : []

    const receitasPopulares = produtosMaisVendidos().map(p => ({
      name: p.nome,
      value: p.valor
    }))

    const crescimentoMensal = vendasMensais.map(v => ({
      name: v.name,
      value: v.vendas
    }))

    return {
      vendasMensais,
      gastosCategoria,
      receitasPopulares,
      crescimentoMensal
    }
  }

  const exportarRelatorio = () => {
    const dados = {
      periodo: `${periodoFiltro} dias`,
      dataGeracao: new Date().toLocaleDateString('pt-BR'),
      metricas,
      produtosMaisVendidos: produtosMaisVendidos(),
      clientesMaisValiosos: clientesMaisValiosos(),
      documentos: documentos.length,
      analiseDespesas
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dados, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `relatorio-${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const chartData = prepareChartData()

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
                Relatórios & Analytics
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Acompanhe o desempenho do seu negócio
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
            
            <button
              onClick={() => setShowDocumentManager(true)}
              className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Nota Fiscal</span>
            </button>
            
            <button
              onClick={exportarRelatorio}
              className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'charts'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Gráficos Avançados
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'documents'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Documentos Fiscais
            </button>
          </div>
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
                    <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
                    <p className={`text-2xl font-bold ${metricas.lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {metricas.lucroLiquido.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {metricas.lucroLiquido >= 0 ? 'Lucro' : 'Prejuízo'} no período
                    </p>
                  </div>
                  <TrendingUp className={`h-8 w-8 ${metricas.lucroLiquido >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold text-blue-600">
                      R$ {metricas.ticketMedio.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Por orçamento aprovado
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Produtos e Clientes */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8">
              {/* Produtos Mais Vendidos */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Produtos Mais Vendidos
                </h3>
                
                {produtosMaisVendidos().length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma venda no período</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {produtosMaisVendidos().map((produto, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-purple-600">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{produto.nome}</p>
                            <p className="text-sm text-gray-500">
                              {produto.quantidade} unidades vendidas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            R$ {produto.valor.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clientes Mais Valiosos */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Clientes Mais Valiosos
                </h3>
                
                {clientesMaisValiosos().length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum cliente no período</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clientesMaisValiosos().map((cliente, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{cliente.nome}</p>
                            <p className="text-sm text-gray-500">
                              {cliente.pedidos} pedidos realizados
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            R$ {cliente.valor.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div>
            <AdvancedCharts
              vendasMensais={chartData.vendasMensais}
              gastosCategoria={chartData.gastosCategoria}
              receitasPopulares={chartData.receitasPopulares}
              crescimentoMensal={chartData.crescimentoMensal}
            />
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            {user && (
              <DocumentManager
                userId={user.id}
                onDocumentsChange={setDocumentos}
              />
            )}
            
            {analiseDespesas && (
              <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Análise de Despesas por IA
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Tendências</h4>
                    <ul className="space-y-2">
                      {analiseDespesas.tendencias?.map((tendencia: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {tendencia}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Recomendações</h4>
                    <ul className="space-y-2">
                      {analiseDespesas.recomendacoes?.map((recomendacao: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {recomendacao}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Upload de Documentos */}
      {showDocumentManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Gerenciar Documentos Fiscais</h2>
                <button
                  onClick={() => setShowDocumentManager(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {user && (
                <DocumentManager
                  userId={user.id}
                  onDocumentsChange={setDocumentos}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}