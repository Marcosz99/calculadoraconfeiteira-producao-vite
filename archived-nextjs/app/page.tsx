'use client'

import { useAuth } from '@/components/auth/local-auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Cake,
  PieChart,
  FileText,
  Zap,
  Star,
  Users
} from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cake className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold text-gray-900">DoceCalc</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#funcionalidades" className="text-gray-600 hover:text-primary transition-colors">
              Funcionalidades
            </a>
            <a href="#planos" className="text-gray-600 hover:text-primary transition-colors">
              Planos
            </a>
            <a href="#depoimentos" className="text-gray-600 hover:text-primary transition-colors">
              Depoimentos
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="doce">Cadastrar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            +500k Confeiteiras no Brasil 🇧🇷
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Pare de vender no 
            <span className="text-transparent bg-gradient-doce bg-clip-text"> prejuízo!</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A calculadora completa para confeiteiras que querem ter uma confeitaria 
            <strong className="text-primary"> realmente lucrativa</strong>. 
            Calcule preços corretos e venda com confiança!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/auth/register">
              <Button size="xl" variant="doce" className="w-full sm:w-auto">
                Começar Grátis Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="#demo">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Ver Demonstração
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">8k+</div>
              <div className="text-gray-600">Buscas mensais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500k+</div>
              <div className="text-gray-600">Confeiteiras BR</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">R$ 19</div>
              <div className="text-gray-600">Por mês apenas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problemas */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Você já passou por isso? 😰
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A maioria das confeiteiras comete estes erros que quebram o negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center">
                  <DollarSign className="h-6 w-6 mr-2" />
                  Preço no "achômetro"
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">
                  "Cobro R$ 3,00 o brigadeiro porque a concorrência cobra isso..."
                  Resultado: prejuízo mascarado que só aparece no final do mês.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center">
                  <Clock className="h-6 w-6 mr-2" />
                  Esquece a mão de obra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">
                  "Só conto o ingrediente, meu trabalho é de graça!"
                  Seu tempo vale dinheiro e precisa estar no preço.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  Margem de lucro baixa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">
                  "20% de lucro está bom..." Não! Para crescer o negócio, 
                  você precisa de margens maiores.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center">
                  <FileText className="h-6 w-6 mr-2" />
                  Orçamentos amadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">
                  "Mando por WhatsApp mesmo..." Clientes não levam a sério
                  e você perde vendas por parecer amadora.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              A solução completa para sua confeitaria 🎂
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para calcular preços corretos e ter um negócio lucrativo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calculator className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Calculadora Inteligente</CardTitle>
                <CardDescription>
                  Calcula automaticamente custos de ingredientes, mão de obra, 
                  custos fixos e margem de lucro ideal.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Cake className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Base de Receitas</CardTitle>
                <CardDescription>
                  Cadastre suas receitas com ingredientes e quantidades. 
                  Templates prontos para começar rápido.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Preços Atualizados</CardTitle>
                <CardDescription>
                  Base de ingredientes com preços médios do mercado, 
                  atualizada por nossa comunidade.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <PieChart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Relatórios Inteligentes</CardTitle>
                <CardDescription>
                  Veja quais produtos dão mais lucro, análise de custos 
                  e insights para otimizar seu negócio.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Orçamentos Profissionais</CardTitle>
                <CardDescription>
                  Gere orçamentos em PDF profissionais para impressionar
                  seus clientes e fechar mais vendas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Cálculo Instantâneo</CardTitle>
                <CardDescription>
                  Mude a quantidade e veja o preço atualizar na hora. 
                  Perfeito para atender clientes rapidamente.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Veja como é simples usar 📱
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Interface criada especialmente para confeiteiras, mesmo quem não é expert em tecnologia
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-doce p-8 rounded-2xl text-white text-center">
              <h3 className="text-2xl font-bold mb-4">🎯 Exemplo Prático: Brigadeiro</h3>
              
              <div className="grid md:grid-cols-3 gap-6 text-left bg-white/10 p-6 rounded-lg">
                <div>
                  <h4 className="font-semibold mb-2">📝 Ingredientes:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Leite condensado: R$ 3,95</li>
                    <li>• Chocolate pó: R$ 1,25</li>
                    <li>• Manteiga: R$ 0,27</li>
                    <li>• Granulado: R$ 2,00</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">⚡ Cálculo Automático:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Custo ingredientes: R$ 7,47</li>
                    <li>• Mão de obra (30min): R$ 12,50</li>
                    <li>• Custos fixos: R$ 2,40</li>
                    <li>• Margem 60%: R$ 13,42</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">💰 Resultado:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Custo total: R$ 22,37</strong></li>
                    <li>• <strong>Preço final: R$ 35,79</strong></li>
                    <li>• <strong>Por unidade: R$ 1,20</strong></li>
                    <li>• ✅ Lucro real: R$ 13,42</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <Badge className="bg-green-500 text-white">
                  ✨ Antes você cobrava R$ 1,00 e tinha prejuízo. Agora R$ 1,20 com 60% de lucro!
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Escolha seu plano 💎
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comece grátis e upgrade quando seu negócio crescer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Free */}
            <Card className="relative">
              <CardHeader>
                <div className="text-center">
                  <CardTitle className="text-2xl mb-2">Plano Gratuito</CardTitle>
                  <div className="text-4xl font-bold text-primary">R$ 0</div>
                  <p className="text-gray-600">Para sempre</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    3 receitas cadastradas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Calculadora básica
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Base de ingredientes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Suporte por email
                  </li>
                </ul>
                <Link href="/auth/register">
                  <Button className="w-full" variant="outline">
                    Começar Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Plano Pro */}
            <Card className="relative border-primary bg-gradient-to-b from-primary/5 to-transparent">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white">Mais Popular 🔥</Badge>
              </div>
              <CardHeader>
                <div className="text-center">
                  <CardTitle className="text-2xl mb-2">Plano Profissional</CardTitle>
                  <div className="text-4xl font-bold text-primary">R$ 29</div>
                  <p className="text-gray-600">Por mês</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Receitas ilimitadas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Calculadora avançada
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Orçamentos profissionais
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Relatórios detalhados
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Economia de escala
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Templates de receitas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Suporte prioritário
                  </li>
                </ul>
                <Link href="/auth/register">
                  <Button className="w-full" variant="doce">
                    Começar Teste Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-gray-600 mt-8">
            💳 <strong>7 dias grátis</strong> no plano PRO · Cancele quando quiser · Sem taxas extras
          </p>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              O que as confeiteiras estão falando 💬
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Resultados reais de quem já está usando o DoceCalc
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "Descobri que estava perdendo dinheiro em 70% dos meus produtos! 
                  Agora com os preços corretos, meu lucro triplicou em 2 meses."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-semibold">Maria Silva</div>
                <div className="text-sm text-gray-600">Doces da Mari - SP</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "Os orçamentos profissionais em PDF impressionam os clientes. 
                  Minha taxa de fechamento de vendas aumentou 40%!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-semibold">Ana Costa</div>
                <div className="text-sm text-gray-600">Confeitaria Ana - RJ</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "Finalmente sei quanto cobrar! A calculadora é muito fácil de usar 
                  e me deu confiança para precificar corretamente."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-semibold">Carla Santos</div>
                <div className="text-sm text-gray-600">Carla Doces - MG</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-doce text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Pronta para ter uma confeitaria lucrativa? 🚀
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a centenas de confeiteiras que já descobriram como calcular preços corretos 
            e ter um negócio próspero
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/auth/register">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100">
                Começar Grátis Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center items-center space-x-6 text-sm opacity-75">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Grátis para sempre
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Sem cartão de crédito
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Comece em 2 minutos
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Cake className="h-6 w-6 text-primary" />
                <span className="text-xl font-display font-bold text-white">DoceCalc</span>
              </div>
              <p className="text-sm">
                A calculadora completa para confeiteiras que querem ter um negócio lucrativo.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Produto</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#funcionalidades" className="hover:text-primary">Funcionalidades</a></li>
                <li><a href="#planos" className="hover:text-primary">Planos</a></li>
                <li><a href="#demo" className="hover:text-primary">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:contato@docecalc.com" className="hover:text-primary">Contato</a></li>
                <li><a href="/ajuda" className="hover:text-primary">Central de Ajuda</a></li>
                <li><a href="/blog" className="hover:text-primary">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacidade" className="hover:text-primary">Privacidade</a></li>
                <li><a href="/termos" className="hover:text-primary">Termos</a></li>
                <li><a href="/cookies" className="hover:text-primary">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 DoceCalc. Todos os direitos reservados.</p>
            <p className="mt-2 text-gray-500">Feito com 💖 para confeiteiras brasileiras</p>
          </div>
        </div>
      </footer>
    </div>
  )
}