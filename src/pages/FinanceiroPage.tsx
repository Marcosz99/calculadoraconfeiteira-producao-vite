import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, Upload, Camera, FileText, DollarSign, 
  TrendingUp, TrendingDown, PieChart, Calendar,
  CheckCircle, AlertCircle, Eye, Trash2, Edit
} from 'lucide-react'

// FASE 9.1 & 9.2: Interfaces do Sistema Financeiro
interface TransacaoFinanceira {
  id: string
  tipo: 'receita' | 'despesa'
  valor: number
  data: string
  categoria: string
  descricao: string
  metodo_pagamento: 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito' | 'transferencia'
  fornecedor_cliente?: string
  imagem_comprovante?: string
  extraido_por_ocr: boolean
  verificado: boolean
  criado_em: string
}

interface ResumoFinanceiro {
  receita_total_mes: number
  despesa_total_mes: number
  lucro_liquido: number
  margem_real: number
  transacoes_mes: number
}

export default function FinanceiroPage() {
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>([
    // Mock data para demonstração (FASE 9.2: Dados do mês atual)
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
    }
  ])
  
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState<'receita' | 'despesa' | null>(null)
  const [processandoOCR, setProcessandoOCR] = useState(false)
  const [dadosExtraidos, setDadosExtraidos] = useState<Partial<TransacaoFinanceira> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // FASE 9.2: Cálculo do resumo financeiro
  const calcularResumo = (): ResumoFinanceiro => {
    const mesAtual = new Date().toISOString().substring(0, 7) // YYYY-MM
    const transacoesMes = transacoes.filter(t => t.data.startsWith(mesAtual))
    
    const receitas = transacoesMes.filter(t => t.tipo === 'receita')
    const despesas = transacoesMes.filter(t => t.tipo === 'despesa')
    
    const receita_total_mes = receitas.reduce((sum, t) => sum + t.valor, 0)
    const despesa_total_mes = despesas.reduce((sum, t) => sum + t.valor, 0)
    const lucro_liquido = receita_total_mes - despesa_total_mes
    const margem_real = receita_total_mes > 0 ? (lucro_liquido / receita_total_mes) * 100 : 0

    return {
      receita_total_mes,
      despesa_total_mes,
      lucro_liquido,
      margem_real,
      transacoes_mes: transacoesMes.length
    }
  }

  const resumo = calcularResumo()

  // FASE 9.1: Processamento OCR + IA
  const processarComprovanteOCR = async (file: File, tipo: 'receita' | 'despesa') => {
    setProcessandoOCR(true)
    setDadosExtraidos(null)

    try {
      // Simular processamento OCR + IA
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Simular dados extraídos pela IA
      const dadosSimulados: Partial<TransacaoFinanceira> = {
        tipo,
        valor: tipo === 'receita' ? 125.50 : 45.80,
        data: new Date().toISOString().substring(0, 10),
        categoria: tipo === 'receita' ? 'Vendas Docinhos' : 'Ingredientes',
        descricao: tipo === 'receita' ? 'Venda de Brigadeiros' : 'Açúcar e Manteiga - Mercado',
        metodo_pagamento: 'pix',
        fornecedor_cliente: tipo === 'receita' ? 'Cliente Ana' : 'Mercado Central',
        extraido_por_ocr: true,
        verificado: false
      }

      setDadosExtraidos(dadosSimulados)
    } catch (error) {
      alert('❌ Erro ao processar comprovante. Tente novamente.')
    } finally {
      setProcessandoOCR(false)
    }
  }

  const confirmarTransacao = () => {
    if (!dadosExtraidos) return

    const novaTransacao: TransacaoFinanceira = {
      id: Date.now().toString(),
      ...dadosExtraidos as TransacaoFinanceira,
      criado_em: new Date().toISOString()
    }

    setTransacoes(prev => [novaTransacao, ...prev])
    setDadosExtraidos(null)
    setShowUploadModal(false)
    setUploadType(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && uploadType) {
      processarComprovanteOCR(file, uploadType)
    }
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
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
              <h1 className="text-2xl font-bold text-gray-900">💰 Controle Financeiro</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setUploadType('receita')
                  setShowUploadModal(true)
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                + Receita
              </button>
              <button
                onClick={() => {
                  setUploadType('despesa')
                  setShowUploadModal(true)
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                + Despesa
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* FASE 9.2: Dashboard Financeiro - Cards Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-2xl font-bold text-red-600">{formatarMoeda(resumo.despesa_total_mes)}</p>
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

        {/* FASE 9.2: Insights Financeiros */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
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
          </div>
        </div>

        {/* Lista de Transações */}
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
                {transacoes.map((transacao) => (
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
      </div>

      {/* FASE 9.1: Modal de Upload de Comprovante */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {uploadType === 'receita' ? '💰 Adicionar Receita' : '💸 Adicionar Despesa'}
            </h3>

            {!dadosExtraidos ? (
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  {uploadType === 'receita' 
                    ? 'Faça upload de um comprovante de venda ou nota fiscal'
                    : 'Faça upload de uma nota fiscal ou comprovante de compra'
                  }
                </p>

                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {processandoOCR ? 'Processando comprovante...' : 'Clique para selecionar arquivo'}
                  </p>
                  {processandoOCR && (
                    <div className="mt-4">
                      <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm">
                        🤖 IA extraindo dados automaticamente...
                      </div>
                    </div>
                  )}
                </div>

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
            ) : (
              // Dados extraídos pela IA
              <div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Dados Extraídos com IA</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    Nossa IA processou o comprovante e extraiu os seguintes dados:
                  </p>
                </div>

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
    </div>
  )
}