import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, History, Trash2, Search, Download, Calendar } from 'lucide-react'
import { AppLayout } from '../components/Layout'
import { CalculoPreco } from '../types'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function HistoricoCalculosPage() {
  const { user } = useAuth()
  const [historico, setHistorico] = useState<CalculoPreco[]>([])
  const [filteredHistorico, setFilteredHistorico] = useState<CalculoPreco[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user) {
      const savedHistorico = getFromLocalStorage<CalculoPreco[]>('doce_historico_calculos', [])
      setHistorico(savedHistorico)
      setFilteredHistorico(savedHistorico)
    }
  }, [user])

  useEffect(() => {
    const filtered = historico.filter(calculo => 
      calculo.breakdown.some(item => 
        item.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    setFilteredHistorico(filtered)
  }, [searchTerm, historico])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const excluirCalculo = (index: number) => {
    const novoHistorico = historico.filter((_, i) => i !== index)
    setHistorico(novoHistorico)
    saveToLocalStorage('doce_historico_calculos', novoHistorico)
  }

  const exportarHistorico = () => {
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(historico, null, 2)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = `historico-calculos-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/calculadora">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Cálculos</h1>
          <p className="text-gray-600">Visualize e gerencie seus cálculos anteriores</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por ingrediente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button 
            onClick={exportarHistorico}
            variant="outline"
            disabled={historico.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Histórico
          </Button>
        </div>

        {/* Lista de Cálculos */}
        {filteredHistorico.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum cálculo encontrado' : 'Nenhum cálculo realizado'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Tente buscar por outro termo'
                  : 'Faça seu primeiro cálculo na calculadora de preços'
                }
              </p>
              <Link to="/calculadora">
                <Button>
                  Ir para Calculadora
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistorico.map((calculo, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Cálculo #{historico.length - index}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>Calculado recentemente</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(calculo.preco_final)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => excluirCalculo(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Custo dos Ingredientes</p>
                      <p className="font-semibold">{formatCurrency(calculo.custo_ingredientes)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Custo da Mão de Obra</p>
                      <p className="font-semibold">{formatCurrency(calculo.custo_mao_obra)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Margem de Lucro</p>
                      <p className="font-semibold">{calculo.margem_lucro}%</p>
                    </div>
                  </div>
                  
                  {/* Ingredientes */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Ingredientes:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {calculo.breakdown.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-700">{item.nome} ({item.quantidade})</span>
                          <span className="font-medium">{formatCurrency(item.custo)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}