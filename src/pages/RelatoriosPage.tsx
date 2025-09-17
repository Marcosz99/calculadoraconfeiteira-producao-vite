import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, DollarSign, Package, Users, Calendar, Download, BarChart3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Orcamento, Cliente, Receita } from '../types'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../utils/localStorage'

export default function RelatoriosPage() {
  const { user } = useAuth()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [periodoFiltro, setPeriodoFiltro] = useState('30') // 30 dias

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
    clientesAtivos: new Set(orcamentosAprovados.map(o => o.cliente_id)).size
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

  // Vendas por dia (últimos 30 dias)
  const vendasPorDia = () => {
    const hoje = new Date()
    const dias = []
    
    for (let i = 29; i >= 0; i--) {
      const data = new Date(hoje.getTime() - i * 24 * 60 * 60 * 1000)
      const dataStr = data.toISOString().split('T')[0]
      
      const vendasDia = orcamentosAprovados
        .filter(o => o.data_criacao.split('T')[0] === dataStr)
        .reduce((total, o) => total + o.valor_total, 0)
      
      dias.push({
        data: data.getDate() + '/' + (data.getMonth() + 1),
        valor: vendasDia
      })
    }
    
    return dias
  }

  const dadosVendasDiarias = vendasPorDia()
  const maxVenda = Math.max(...dadosVendasDiarias.map(d => d.valor))

  const exportarRelatorio = () => {
    const dados = {
      periodo: `${periodoFiltro} dias`,
      dataGeracao: new Date().toLocaleDateString('pt-BR'),
      metricas,
      produtosMaisVendidos: produtosMaisVendidos(),
      clientesMaisValiosos: clientesMaisValiosos(),
      vendasDiarias: dadosVendasDiarias
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dados, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `relatorio-${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
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
                Relatórios & Analytics
              </h1>
              <p className="text-gray-600">
                Acompanhe o desempenho do seu negócio
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
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
              onClick={exportarRelatorio}
              className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-blue-600">
                  {metricas.taxaAprovacao.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {metricas.orcamentosAprovados} de {metricas.totalOrcamentos} orçamentos
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-purple-600">
                  R$ {metricas.ticketMedio.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Valor médio por pedido
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {metricas.clientesAtivos}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Clientes com pedidos
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Gráfico de Vendas */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Vendas Diárias - Últimos 30 dias
          </h3>
          
          <div className="space-y-2">
            {dadosVendasDiarias.map((dia, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-16 text-sm text-gray-600 text-right">
                  {dia.data}
                </div>
                <div className="flex-1 flex items-center">
                  <div 
                    className="bg-purple-500 h-6 rounded"
                    style={{
                      width: maxVenda > 0 ? `${(dia.valor / maxVenda) * 100}%` : '0%',
                      minWidth: dia.valor > 0 ? '20px' : '0px'
                    }}
                  ></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    R$ {dia.valor.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        {/* Resumo do Período */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Resumo do Período ({periodoFiltro} dias)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {orcamentosAprovados.length}
              </div>
              <div className="text-sm text-gray-600">Vendas Realizadas</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {new Set(orcamentosAprovados.map(o => o.cliente_id)).size}
              </div>
              <div className="text-sm text-gray-600">Clientes Únicos</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {orcamentosAprovados.reduce((total, o) => total + o.itens.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Itens Vendidos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}