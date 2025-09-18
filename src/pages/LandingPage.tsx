import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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
  Users,
  Play,
  Check
} from 'lucide-react'
import { planos } from '../data/planos'

export default function LandingPage() {
  const [emailDemo, setEmailDemo] = useState('')
  const [showCalculatorDemo, setShowCalculatorDemo] = useState(false)
  
  // Demo calculator
  const [demoIngredientes, setDemoIngredientes] = useState([
    { nome: 'Leite condensado', quantidade: 1, preco: 3.95 },
    { nome: 'Chocolate pó', quantidade: 50, preco: 0.025 },
    { nome: 'Manteiga', quantidade: 15, preco: 0.018 }
  ])
  const [demoMargem, setDemoMargem] = useState(60)
  const [demoCustoFixo, setDemoCustoFixo] = useState(2.40)
  const [demoMaoObra, setDemoMaoObra] = useState(12.50)

  const calcularDemo = () => {
    const custoIngredientes = demoIngredientes.reduce((total, ing) => total + (ing.quantidade * ing.preco), 0)
    const custoTotal = custoIngredientes + demoCustoFixo + demoMaoObra
    return custoTotal * (1 + demoMargem / 100)
  }

  const depoimentos = [
    {
      nome: "Maria Silva",
      confeitaria: "Doces da Maria",
      avatar: "👩‍🍳",
      texto: "O DoceCalc revolucionou meu negócio! Agora sei exatamente quanto cobrar e meu lucro aumentou 40%.",
      estrelas: 5
    },
    {
      nome: "Ana Costa",
      confeitaria: "Bolos & Cia",
      avatar: "👩‍🦰",
      texto: "Antes eu chutava os preços. Com o DoceCalc, tenho controle total dos custos e margem de lucro.",
      estrelas: 5
    },
    {
      nome: "Lucia Santos",
      confeitaria: "Delícias da Lu",
      avatar: "👩‍🦳",
      texto: "Excelente ferramenta! A gestão de ingredientes me ajuda muito no controle de estoque.",
      estrelas: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cake className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">DoceCalc</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#funcionalidades" className="text-gray-600 hover:text-pink-500 transition-colors">
              Funcionalidades
            </a>
            <a href="#planos" className="text-gray-600 hover:text-pink-500 transition-colors">
              Planos
            </a>
            <a href="#depoimentos" className="text-gray-600 hover:text-pink-500 transition-colors">
              Depoimentos
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Entrar
            </Link>
            <Link
              to="/login"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-4 inline-flex items-center px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
            +500k Confeiteiras no Brasil 🇧🇷
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Pare de vender no 
            <span className="text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text"> prejuízo!</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A calculadora completa para confeiteiras que querem ter uma confeitaria 
            <strong className="text-pink-600"> realmente lucrativa</strong>. 
            Calcule preços corretos e venda com confiança!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/login"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Começar Grátis Agora</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            <button
              onClick={() => setShowCalculatorDemo(!showCalculatorDemo)}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Ver Demonstração</span>
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">8k+</div>
              <div className="text-gray-600">Buscas mensais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">500k+</div>
              <div className="text-gray-600">Confeiteiras BR</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">R$ 29</div>
              <div className="text-gray-600">Por mês apenas</div>
            </div>
          </div>

          {/* Calculadora Demo */}
          {showCalculatorDemo && (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                🎯 Exemplo Prático: Brigadeiro
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6 text-left bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg">
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
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ✨ Antes você cobrava R$ 1,00 e tinha prejuízo. Agora R$ 1,20 com 60% de lucro!
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Problemas */}
      <section className="py-20 bg-white/70">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Você já passou por isso? 😰
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A maioria das confeiteiras comete estes erros que quebram o negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border-2 border-red-200 bg-red-50/50 rounded-lg p-6">
              <div className="flex items-center text-red-700 mb-4">
                <DollarSign className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-bold">Preço no "achômetro"</h3>
              </div>
              <p className="text-red-600">
                "Cobro R$ 3,00 o brigadeiro porque a concorrência cobra isso..."
                Resultado: prejuízo mascarado que só aparece no final do mês.
              </p>
            </div>

            <div className="border-2 border-red-200 bg-red-50/50 rounded-lg p-6">
              <div className="flex items-center text-red-700 mb-4">
                <Clock className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-bold">Esquece a mão de obra</h3>
              </div>
              <p className="text-red-600">
                "Só conto o ingrediente, meu trabalho é de graça!"
                Seu tempo vale dinheiro e precisa estar no preço.
              </p>
            </div>

            <div className="border-2 border-red-200 bg-red-50/50 rounded-lg p-6">
              <div className="flex items-center text-red-700 mb-4">
                <TrendingUp className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-bold">Margem de lucro baixa</h3>
              </div>
              <p className="text-red-600">
                "20% de lucro está bom..." Não! Para crescer o negócio, 
                você precisa de margens maiores.
              </p>
            </div>

            <div className="border-2 border-red-200 bg-red-50/50 rounded-lg p-6">
              <div className="flex items-center text-red-700 mb-4">
                <FileText className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-bold">Orçamentos amadores</h3>
              </div>
              <p className="text-red-600">
                "Mando por WhatsApp mesmo..." Clientes não levam a sério
                e você perde vendas por parecer amadora.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A solução completa para sua confeitaria 🎂
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para calcular preços corretos e ter um negócio lucrativo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Calculator className="h-12 w-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Calculadora Inteligente</h3>
              <p className="text-gray-600">
                Calcula automaticamente custos de ingredientes, mão de obra, 
                custos fixos e margem de lucro ideal.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Cake className="h-12 w-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Base de Receitas</h3>
              <p className="text-gray-600">
                Cadastre suas receitas com ingredientes e quantidades. 
                Templates prontos para começar rápido.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <DollarSign className="h-12 w-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Preços Atualizados</h3>
              <p className="text-gray-600">
                Base de ingredientes com preços médios do mercado, 
                atualizada por nossa comunidade.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <PieChart className="h-12 w-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Relatórios Inteligentes</h3>
              <p className="text-gray-600">
                Veja quais produtos dão mais lucro, análise de custos 
                e insights para otimizar seu negócio.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <FileText className="h-12 w-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Orçamentos Profissionais</h3>
              <p className="text-gray-600">
                Gere orçamentos em PDF profissionais para impressionar
                seus clientes e fechar mais vendas.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Zap className="h-12 w-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cálculo Instantâneo</h3>
              <p className="text-gray-600">
                Mude a quantidade e veja o preço atualizar na hora. 
                Perfeito para atender clientes rapidamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 bg-white/70">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Escolha seu plano 💎
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comece grátis e upgrade quando seu negócio crescer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Free */}
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano Gratuito</h3>
                <div className="text-4xl font-bold text-pink-500">R$ 0</div>
                <p className="text-gray-600">Para sempre</p>
              </div>
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
              <Link
                to="/login"
                className="w-full py-3 px-4 rounded-lg font-medium transition-colors text-center block bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Começar Grátis
              </Link>
            </div>

            {/* Plano Pro */}
            <div className="bg-white rounded-lg shadow-lg p-6 relative border-2 border-pink-500">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular 🔥
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano Profissional</h3>
                <div className="text-4xl font-bold text-pink-500">R$ 29</div>
                <p className="text-gray-600">Por mês</p>
              </div>
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
              <Link
                to="/login"
                className="w-full py-3 px-4 rounded-lg font-medium transition-colors text-center block bg-pink-500 text-white hover:bg-pink-600"
              >
                Teste 7 dias grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossas clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Confeiteiras reais, resultados reais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {depoimentos.map((depoimento, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{depoimento.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{depoimento.nome}</h4>
                    <p className="text-gray-600 text-sm">{depoimento.confeitaria}</p>
                    <div className="flex space-x-1 mt-1">
                      {[...Array(depoimento.estrelas)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{depoimento.texto}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronta para aumentar seus lucros?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Junte-se a milhares de confeiteiras que já transformaram seus negócios
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="email"
              value={emailDemo}
              onChange={(e) => setEmailDemo(e.target.value)}
              placeholder="Digite seu melhor email"
              className="px-6 py-4 rounded-lg text-gray-900 text-lg w-full sm:w-auto"
            />
            <Link
              to="/login"
              className="bg-white text-pink-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Começar Grátis
            </Link>
          </div>
          
          <p className="text-white opacity-75 mt-4 text-sm">
            ✓ Grátis para sempre  ✓ Sem cartão de crédito  ✓ Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Cake className="h-6 w-6 text-pink-400" />
                <span className="text-xl font-bold">DoceCalc</span>
              </div>
              <p className="text-gray-400 text-sm">
                A calculadora de preços definitiva para confeiteiras que querem vender mais e lucrar melhor.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/login" className="hover:text-white">Funcionalidades</Link></li>
                <li><Link to="/login" className="hover:text-white">Preços</Link></li>
                <li><Link to="/login" className="hover:text-white">Depoimentos</Link></li>
                <li><Link to="/login" className="hover:text-white">Suporte</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/login" className="hover:text-white">Sobre nós</Link></li>
                <li><Link to="/login" className="hover:text-white">Blog</Link></li>
                <li><Link to="/login" className="hover:text-white">Carreiras</Link></li>
                <li><Link to="/login" className="hover:text-white">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/login" className="hover:text-white">Privacidade</Link></li>
                <li><Link to="/login" className="hover:text-white">Termos</Link></li>
                <li><Link to="/login" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 DoceCalc. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}