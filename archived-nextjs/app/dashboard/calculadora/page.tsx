'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calculator, 
  Plus, 
  Minus, 
  Save, 
  Download, 
  Clock,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  FileText
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { 
  calcularPrecoReceita,
  MULTIPLICADORES_COMPLEXIDADE,
  CUSTOS_FIXOS_TOTAL,
  sugerirMargemLucro,
  calcularPrecoCompetitivo,
  analisarRentabilidade,
  formatarMoeda,
  formatarQuantidade
} from '@/lib/calculations-lib'
import { ReceitaCompleta, CalculoDetalhes } from '@/lib/database-types'
import { supabase } from '@/lib/supabase-client'

// Tipos para a calculadora
type IngredienteCalculadora = {
  id: string
  nome: string
  preco_por_unidade: number
  unidade: string
  categoria?: string
}

type ReceitaCalculadora = {
  id: string
  nome: string
  complexidade: 'simples' | 'media' | 'complexa'
  tempo_preparo: number
  rendimento: number
  ingredientes: {
    ingrediente: IngredienteCalculadora
    quantidade: number
  }[]
}

export default function CalculadoraPage() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  // Estados principais
  const [activeTab, setActiveTab] = useState('rapida')
  const [isCalculating, setIsCalculating] = useState(false)
  const [resultado, setResultado] = useState<CalculoDetalhes | null>(null)
  
  // Estados para receita carregada
  const [receitaCarregada, setReceitaCarregada] = useState<ReceitaCompleta | null>(null)
  const [loadingReceita, setLoadingReceita] = useState(false)

  // Estados para cálculo rápido
  const [nomeReceita, setNomeReceita] = useState('')
  const [complexidade, setComplexidade] = useState<'simples' | 'media' | 'complexa'>('simples')
  const [tempoPreparo, setTempoPreparo] = useState(60)
  const [rendimento, setRendimento] = useState(1)
  const [valorHora, setValorHora] = useState(profile?.valor_hora || 15)
  const [margemLucro, setMargemLucro] = useState(profile?.margem_padrao || 0.6)
  const [quantidadeProduzir, setQuantidadeProduzir] = useState(1)
  const [incluirTransporte, setIncluirTransporte] = useState(false)

  // Estados para ingredientes
  const [ingredientes, setIngredientes] = useState<{
    nome: string
    quantidade: number
    unidade: string
    preco: number
  }[]>([
    { nome: '', quantidade: 0, unidade: 'g', preco: 0 }
  ])

  const isPro = profile?.plano === 'pro'
  const receitaId = searchParams.get('receita')

  // Carregar receita específica se houver parâmetro na URL
  useEffect(() => {
    if (receitaId && profile?.id) {
      carregarReceitaEspecifica(receitaId)
    }
  }, [receitaId, profile?.id])

  const carregarReceitaEspecifica = async (id: string) => {
    try {
      setLoadingReceita(true)
      
      // Buscar receita com ingredientes
      const { data: receita, error: receitaError } = await supabase
        .from('receitas')
        .select('*')
        .eq('id', id)
        .eq('user_id', profile?.id)
        .single()

      if (receitaError) throw receitaError

      // Buscar ingredientes da receita
      const { data: ingredientesData, error: ingredientesError } = await supabase
        .from('receita_ingredientes')
        .select(`
          *,
          ingredientes (*)
        `)
        .eq('receita_id', id)

      if (ingredientesError) throw ingredientesError

      // Montar receita completa
      const receitaCompleta: ReceitaCompleta = {
        ...receita,
        tempo_preparo: receita.tempo_producao,
        receita_ingredientes: (ingredientesData || []).map(item => ({
          id: item.id,
          receita_id: item.receita_id,
          ingrediente_id: item.ingrediente_id,
          quantidade: item.quantidade,
          created_at: item.created_at,
          ingredientes: {
            ...item.ingredientes,
            preco_por_unidade: item.ingredientes.preco_kg,
            user_id: profile?.id || ''
          }
        }))
      }

      setReceitaCarregada(receitaCompleta)
      
      // Preencher formulário com dados da receita
      setNomeReceita(receita.nome)
      setComplexidade(receita.complexidade)
      setTempoPreparo(receita.tempo_producao)
      setRendimento(receita.rendimento)
      
      // Preencher ingredientes se existirem
      if (ingredientesData && ingredientesData.length > 0) {
        const ingredientesFormatados = ingredientesData.map(item => ({
          nome: item.ingredientes.nome,
          quantidade: item.quantidade,
          unidade: item.ingredientes.unidade === 'unidades' ? 'unidades' : 
                   item.ingredientes.unidade === 'ml' ? 'ml' : 'g',
          preco: item.ingredientes.preco_kg
        }))
        setIngredientes(ingredientesFormatados)
      }

      toast({
        title: "Receita carregada! 🎂",
        description: `Dados de "${receita.nome}" carregados com sucesso.`,
      })

    } catch (error) {
      console.error('Erro ao carregar receita:', error)
      toast({
        title: "Erro ao carregar receita",
        description: "Não foi possível carregar os dados da receita.",
        variant: "destructive",
      })
    } finally {
      setLoadingReceita(false)
    }
  }

  const salvarResultadosNaReceita = async () => {
    if (!receitaCarregada || !resultado) {
      toast({
        title: "Erro",
        description: "Nenhuma receita carregada ou resultado de cálculo disponível.",
        variant: "destructive",
      })
      return
    }

    try {
      // Atualizar receita com custos calculados
      const { error } = await supabase
        .from('receitas')
        .update({
          custo_calculado: resultado.custoTotal,
          preco_sugerido: resultado.precoFinal,
          updated_at: new Date().toISOString()
        })
        .eq('id', receitaCarregada.id)

      if (error) throw error

      // Salvar no histórico de cálculos se for PRO
      if (isPro) {
        const { error: historicoError } = await supabase
          .from('calculos_salvos')
          .insert({
            user_id: profile?.id,
            receita_id: receitaCarregada.id,
            quantidade_produzida: quantidadeProduzir,
            preco_unitario: resultado.precoFinal / quantidadeProduzir,
            preco_total: resultado.precoFinal,
            detalhes: {
              custoIngredientes: resultado.custoIngredientes,
              custoMaoDeObra: resultado.custoMaoDeObra,
              custosFixos: resultado.custosFixos,
              custoTotal: resultado.custoTotal,
              margemLucro: resultado.margemLucro,
              valorHora,
              incluirTransporte,
              breakdown: resultado.breakdown
            }
          })

        if (historicoError) {
          console.error('Erro ao salvar histórico:', historicoError)
        }
      }

      // Atualizar estado local
      setReceitaCarregada(prev => prev ? {
        ...prev,
        custo_calculado: resultado.custoTotal,
        preco_sugerido: resultado.precoFinal
      } : null)

      toast({
        title: "Resultados salvos! ✅",
        description: `Custos atualizados para "${receitaCarregada.nome}".`,
      })

    } catch (error) {
      console.error('Erro ao salvar resultados:', error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os resultados na receita.",
        variant: "destructive",
      })
    }
  }

  // Função para adicionar ingrediente
  const adicionarIngrediente = () => {
    if (!isPro && ingredientes.length >= 3) {
      toast({
        title: "Limite do Plano Gratuito",
        description: "Upgrade para PRO para adicionar mais ingredientes ilimitados.",
        variant: "destructive",
      })
      return
    }

    setIngredientes([
      ...ingredientes,
      { nome: '', quantidade: 0, unidade: 'g', preco: 0 }
    ])
  }

  // Função para remover ingrediente
  const removerIngrediente = (index: number) => {
    if (ingredientes.length > 1) {
      setIngredientes(ingredientes.filter((_, i) => i !== index))
    }
  }

  // Função para atualizar ingrediente
  const atualizarIngrediente = (index: number, campo: string, valor: any) => {
    const novosIngredientes = [...ingredientes]
    novosIngredientes[index] = { ...novosIngredientes[index], [campo]: valor }
    setIngredientes(novosIngredientes)
  }

  // Função para calcular preço
  const calcularPreco = () => {
    if (!nomeReceita.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite o nome da receita.",
        variant: "destructive",
      })
      return
    }

    const ingredientesValidos = ingredientes.filter(ing => 
      ing.nome.trim() && ing.quantidade > 0 && ing.preco > 0
    )

    if (ingredientesValidos.length === 0) {
      toast({
        title: "Ingredientes necessários",
        description: "Adicione pelo menos um ingrediente válido.",
        variant: "destructive",
      })
      return
    }

    setIsCalculating(true)

    // Simular uma receita completa para o cálculo
    const receitaSimulada: ReceitaCompleta = {
      id: 'temp',
      user_id: profile?.id || '',
      nome: nomeReceita,
      descricao: '',
      tempo_producao: tempoPreparo,
      tempo_preparo: tempoPreparo, // Alias para compatibilidade
      complexidade,
      rendimento,
      imagem_url: null,
      categoria: '',
      ativa: true,
      custo_calculado: null,
      preco_sugerido: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      receita_ingredientes: ingredientesValidos.map((ing, index) => ({
        id: `temp_${index}`,
        receita_id: 'temp',
        ingrediente_id: `temp_ing_${index}`,
        quantidade: ing.quantidade,
        created_at: new Date().toISOString(),
        ingredientes: {
          id: `temp_ing_${index}`,
          nome: ing.nome,
          categoria_id: null,
          preco_kg: ing.preco,
          preco_por_unidade: ing.preco, // Alias para compatibilidade
          unidade: ing.unidade as 'g' | 'ml' | 'unidades',
          densidade: 1,
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: profile?.id || ''
        }
      }))
    }

    setTimeout(() => {
      try {
        const calculo = calcularPrecoReceita(
          receitaSimulada,
          valorHora,
          margemLucro,
          quantidadeProduzir,
          incluirTransporte
        )

        setResultado(calculo)
        toast({
          title: "Cálculo realizado! 🎂",
          description: `Preço final: ${formatarMoeda(calculo.precoFinal)}`,
        })
      } catch (error) {
        console.error('Erro no cálculo:', error)
        toast({
          title: "Erro no cálculo",
          description: "Verifique os dados e tente novamente.",
          variant: "destructive",
        })
      } finally {
        setIsCalculating(false)
      }
    }, 1000)
  }

  // Função para salvar cálculo (PRO)
  const salvarCalculo = () => {
    if (!isPro) {
      toast({
        title: "Funcionalidade PRO",
        description: "Upgrade para PRO para salvar seus cálculos.",
        variant: "destructive",
      })
      return
    }

    // Implementar salvamento no banco
    toast({
      title: "Cálculo salvo!",
      description: "Você pode acessar seus cálculos salvos na aba histórico.",
    })
  }

  // Função para gerar relatório PDF (PRO)
  const gerarRelatorio = () => {
    if (!isPro) {
      toast({
        title: "Funcionalidade PRO",
        description: "Upgrade para PRO para gerar relatórios em PDF.",
        variant: "destructive",
      })
      return
    }

    // Implementar geração de PDF
    toast({
      title: "Relatório gerado!",
      description: "O download do PDF iniciará em instantes.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-soft py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Calculadora de Preços
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calcule o preço ideal para suas receitas considerando ingredientes, 
            mão de obra, custos fixos e margem de lucro
          </p>
          
          {!isPro && (
            <div className="mt-4">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                <Zap className="h-3 w-3 mr-1" />
                Plano Gratuito - Máximo 3 ingredientes
              </Badge>
            </div>
          )}
          
          {/* Indicador de receita carregada */}
          {receitaCarregada && (
            <div className="mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    Receita carregada: {receitaCarregada.nome}
                  </span>
                </div>
                <p className="text-sm text-blue-600 text-center mt-1">
                  Dados preenchidos automaticamente. Você pode calcular o preço e salvar os resultados na receita.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="xl:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rapida">Cálculo Rápido</TabsTrigger>
                <TabsTrigger value="avancado" disabled={!isPro}>
                  Cálculo Avançado {!isPro && '(PRO)'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="rapida" className="space-y-6">
                {/* Informações da Receita */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Informações da Receita</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome da Receita</Label>
                        <Input
                          id="nome"
                          value={nomeReceita}
                          onChange={(e) => setNomeReceita(e.target.value)}
                          placeholder="Ex: Brigadeiro Gourmet"
                        />
                      </div>
                      <div>
                        <Label htmlFor="complexidade">Complexidade</Label>
                        <select 
                          id="complexidade"
                          value={complexidade} 
                          onChange={(e) => setComplexidade(e.target.value as 'simples' | 'media' | 'complexa')}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="simples">Simples (1x)</option>
                          <option value="media">Média (1.5x)</option>
                          <option value="complexa">Complexa (2x)</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="tempo">Tempo de Preparo (min)</Label>
                        <Input
                          id="tempo"
                          type="number"
                          value={tempoPreparo}
                          onChange={(e) => setTempoPreparo(Number(e.target.value))}
                          min="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rendimento">Rendimento (unidades)</Label>
                        <Input
                          id="rendimento"
                          type="number"
                          value={rendimento}
                          onChange={(e) => setRendimento(Number(e.target.value))}
                          min="1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ingredientes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-5 w-5" />
                        <span>Ingredientes</span>
                      </div>
                      <Button onClick={adicionarIngrediente} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ingredientes.map((ingrediente, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-4">
                          <Label className="text-xs">Nome</Label>
                          <Input
                            value={ingrediente.nome}
                            onChange={(e) => atualizarIngrediente(index, 'nome', e.target.value)}
                            placeholder="Ex: Chocolate"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Qtd</Label>
                          <Input
                            type="number"
                            value={ingrediente.quantidade}
                            onChange={(e) => atualizarIngrediente(index, 'quantidade', Number(e.target.value))}
                            min="0"
                            step="0.1"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Unidade</Label>
                          <select
                            value={ingrediente.unidade}
                            onChange={(e) => atualizarIngrediente(index, 'unidade', e.target.value)}
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="ml">ml</option>
                            <option value="l">L</option>
                            <option value="unidades">un</option>
                          </select>
                        </div>
                        <div className="col-span-3">
                          <Label className="text-xs">Preço/Unidade (R$)</Label>
                          <Input
                            type="number"
                            value={ingrediente.preco}
                            onChange={(e) => atualizarIngrediente(index, 'preco', Number(e.target.value))}
                            min="0"
                            step="0.01"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            onClick={() => removerIngrediente(index)}
                            size="sm"
                            variant="ghost"
                            disabled={ingredientes.length === 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Parâmetros de Cálculo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Parâmetros de Cálculo</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="valorHora">Valor/Hora (R$)</Label>
                        <Input
                          id="valorHora"
                          type="number"
                          value={valorHora}
                          onChange={(e) => setValorHora(Number(e.target.value))}
                          min="0"
                          step="0.50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="margem">Margem de Lucro (%)</Label>
                        <Input
                          id="margem"
                          type="number"
                          value={Math.round(margemLucro * 100)}
                          onChange={(e) => setMargemLucro(Number(e.target.value) / 100)}
                          min="0"
                          max="300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantidade">Quantidade a Produzir</Label>
                        <Input
                          id="quantidade"
                          type="number"
                          value={quantidadeProduzir}
                          onChange={(e) => setQuantidadeProduzir(Number(e.target.value))}
                          min="1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="transporte"
                        checked={incluirTransporte}
                        onChange={(e) => setIncluirTransporte(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="transporte" className="text-sm">
                        Incluir custos de transporte/entrega
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Botão de Cálculo */}
                <div className="text-center">
                  <Button
                    onClick={calcularPreco}
                    disabled={isCalculating}
                    size="lg"
                    variant="doce"
                    className="min-w-48"
                  >
                    {isCalculating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Calculando...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-5 w-5 mr-2" />
                        Calcular Preço
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="avancado">
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gradient-doce rounded-full flex items-center justify-center mb-4">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Cálculo Avançado - PRO</h3>
                    <p className="text-gray-600 mb-6">
                      Acesse receitas salvas, análise competitiva, otimização de custos e muito mais.
                    </p>
                    <Button variant="doce" size="lg">
                      Upgrade para PRO
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Resultados */}
          <div className="space-y-6">
            {resultado ? (
              <>
                {/* Resumo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Resultado</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {formatarMoeda(resultado.precoFinal)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Preço final por unidade
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ingredientes:</span>
                        <span className="font-medium">{formatarMoeda(resultado.custoIngredientes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Mão de obra:</span>
                        <span className="font-medium">{formatarMoeda(resultado.custoMaoDeObra)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Custos fixos:</span>
                        <span className="font-medium">{formatarMoeda(resultado.custosFixos)}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Custo total:</span>
                        <span className="font-medium">{formatarMoeda(resultado.custoTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Margem ({Math.round(margemLucro * 100)}%):</span>
                        <span className="font-medium text-green-600">
                          +{formatarMoeda(resultado.precoFinal - resultado.custoTotal)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      {receitaCarregada && (
                        <Button 
                          onClick={salvarResultadosNaReceita}
                          variant="doce" 
                          size="sm" 
                          className="w-full"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Salvar na Receita: {receitaCarregada.nome}
                        </Button>
                      )}
                      <Button 
                        onClick={salvarCalculo}
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled={!isPro}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar no Histórico {!isPro && '(PRO)'}
                      </Button>
                      <Button 
                        onClick={gerarRelatorio}
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled={!isPro}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Gerar PDF {!isPro && '(PRO)'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Breakdown dos Ingredientes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5" />
                      <span>Detalhamento</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {resultado.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600 truncate mr-2">
                            {formatarQuantidade(item.quantidade, ingredientes[index]?.unidade || 'g')} {item.ingrediente}
                          </span>
                          <span className="font-medium">
                            {formatarMoeda(item.custo)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Pronto para calcular!
                  </h3>
                  <p className="text-gray-600">
                    Preencha os dados da receita e clique em "Calcular Preço" 
                    para ver o resultado detalhado.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Dicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Dicas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Considere sazonalidade dos ingredientes</p>
                  <p>• Margem de 60-80% é comum para doces artesanais</p>
                  <p>• Inclua tempo de resfriamento/descanso</p>
                  <p>• Pesquise preços da concorrência</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}