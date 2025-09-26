import React, { useState, useEffect } from 'react'
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
  Check,
  Menu,
  X,
  AlertTriangle,
  Shield,
  Target,
  Crown,
  Sparkles,
  Timer
} from 'lucide-react'
import { planos } from '../data/planos'

export default function LandingPage() {
  const [emailDemo, setEmailDemo] = useState('')
  const [showCalculatorDemo, setShowCalculatorDemo] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60) // 24 horas em segundos
  
  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  const transformacoes = [
    {
      nome: "Maria Silva",
      cidade: "São Paulo - SP",
      antes: "Vendia brigadeiros a R$ 1,50 e não sobrava nada",
      depois: "Agora cobro R$ 2,40 e lucro R$ 1.200/mês a mais",
      tempo: "em apenas 15 dias",
      avatar: "👩‍🍳"
    },
    {
      nome: "Ana Costa", 
      cidade: "Belo Horizonte - MG",
      antes: "Trabalhava 12h/dia sem saber se estava lucrando",
      depois: "Reduzi para 8h e dobrei o lucro real",
      tempo: "no primeiro mês",
      avatar: "👩‍🦰"
    },
    {
      nome: "Lucia Santos",
      cidade: "Rio de Janeiro - RJ", 
      antes: "Perdia vendas com orçamentos amadores",
      depois: "Fechou contrato de R$ 8.500 com orçamento profissional",
      tempo: "na primeira semana",
      avatar: "👩‍🦳"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % transformacoes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Barra de Urgência */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 text-center text-sm font-medium animate-pulse">
        <div className="flex items-center justify-center space-x-2">
          <Timer className="h-4 w-4" />
          <span>🔥 OFERTA ESPECIAL EXPIRA EM: {formatTime(timeLeft)}</span>
          <Timer className="h-4 w-4" />
        </div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Cake className="h-8 w-8 text-pink-500" />
              <Crown className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold text-gray-900">DoceCalc</span>
            <span className="hidden sm:inline bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              #1 BRASIL
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#problemas" className="text-gray-600 hover:text-pink-500 transition-colors story-link">
              Seu Problema
            </a>
            <a href="#solucao" className="text-gray-600 hover:text-pink-500 transition-colors story-link">
              Nossa Solução
            </a>
            <a href="#planos" className="text-gray-600 hover:text-pink-500 transition-colors story-link">
              Preços
            </a>
            <a href="#garantia" className="text-gray-600 hover:text-pink-500 transition-colors story-link">
              Garantia
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Entrar
            </Link>
            <Link
              to="/login"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover-scale transition-all duration-200 font-medium animate-pulse"
            >
              TESTAR GRÁTIS
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b shadow-lg animate-slide-in-right">
            <div className="px-4 py-4 space-y-4">
              <a 
                href="#problemas" 
                className="block text-gray-600 hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Seu Problema
              </a>
              <a 
                href="#solucao" 
                className="block text-gray-600 hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nossa Solução
              </a>
              <a 
                href="#planos" 
                className="block text-gray-600 hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preços
              </a>
              <div className="border-t pt-4 space-y-2">
                <Link
                  to="/login"
                  className="block text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  TESTAR GRÁTIS AGORA
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section Supremo */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 to-purple-100/20"></div>
        <div className="container mx-auto text-center max-w-5xl relative animate-fade-in">
          <div className="mb-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 text-yellow-800 rounded-full text-sm font-bold animate-bounce-in shadow-lg">
            <Crown className="h-4 w-4 mr-2" />
            O APP MAIS COMPLETO DO MERCADO PARA CONFEITEIRAS
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Descubra Porque 
            <span className="block text-transparent bg-gradient-to-r from-red-600 to-red-700 bg-clip-text"> 78% DAS CONFEITEIRAS</span>
            <span className="text-3xl sm:text-4xl lg:text-5xl">quebram em 2 anos</span>
          </h1>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl text-red-700 font-bold mb-2">
              ⚠️ ALERTA VERMELHO
            </p>
            <p className="text-lg text-red-600">
              Se você está vendendo sem calcular direito, pode estar 
              <strong className="text-red-700"> perdendo até R$ 8.500 por mês</strong> sem nem perceber!
            </p>
          </div>
          
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            O DoceCalc é o <strong className="text-pink-600">único sistema completo</strong> que calcula 
            seus preços REAIS, elimina prejuízos disfarçados e 
            <strong className="text-purple-600"> transforma sua confeitaria em uma máquina de lucro</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-5 rounded-lg text-xl font-black hover:shadow-xl hover-scale transition-all duration-200 flex items-center justify-center space-x-3 animate-pulse"
            >
              <Sparkles className="h-6 w-6" />
              <span>COMEÇAR GRATUITAMENTE AGORA</span>
              <ArrowRight className="h-6 w-6" />
            </Link>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">✓ Sem cartão ✓ Sem compromisso</div>
              <div className="text-sm font-bold text-green-600">Resultados em 5 minutos!</div>
            </div>
          </div>

          {/* Transformação em Destaque */}
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto border-2 border-green-200 animate-scale-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
                <Target className="h-4 w-4 mr-2" />
                TRANSFORMAÇÃO REAL EM DESTAQUE
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-bold text-red-700 mb-2">❌ ANTES (Situação Real)</h4>
                <p className="text-sm text-red-600">
                  • Vendia 200 brigadeiros/mês a R$ 1,50<br/>
                  • Trabalhava 60h/semana<br/>
                  • Sempre no vermelho<br/>
                  • Sem saber onde estava errando
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-700 mb-2">✅ DEPOIS (Com DoceCalc)</h4>
                <p className="text-sm text-green-600">
                  • Vende apenas 150 brigadeiros/mês<br/>
                  • Trabalha 35h/semana<br/>
                  • Preço correto: R$ 2,80 cada<br/>
                  • <strong>Lucro líquido: R$ 2.847/mês</strong>
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-700 mb-2">🎯 RESULTADO</h4>
                <p className="text-sm text-yellow-600">
                  • <strong>Trabalha MENOS</strong><br/>
                  • <strong>Vende MENOS</strong><br/>
                  • <strong>Lucra MUITO MAIS</strong><br/>
                  • Tempo livre para a família
                </p>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 rounded-full font-bold shadow-lg">
                ⏰ Transformação completa em apenas 30 dias
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção dos Problemas */}
      <section id="problemas" className="py-16 sm:py-20 bg-red-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-700 mb-6">
              🚨 PARE DE SE ENGANAR!
            </h2>
            <p className="text-xl sm:text-2xl text-red-600 max-w-3xl mx-auto font-bold">
              Estes erros estão MATANDO sua confeitaria (e você nem percebe)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            <div className="bg-white border-l-8 border-red-500 shadow-xl rounded-lg p-8 hover-lift animate-fade-in">
              <div className="flex items-center text-red-700 mb-4">
                <AlertTriangle className="h-8 w-8 mr-3 flex-shrink-0" />
                <h3 className="text-2xl font-black">ERRO #1: Preço no "Achômetro"</h3>
              </div>
              <div className="space-y-3">
                <p className="text-red-600 font-semibold text-lg">
                  "Cobro R$ 3,00 o brigadeiro porque todo mundo cobra..."
                </p>
                <div className="bg-red-100 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">💸 RESULTADO REAL:</p>
                  <ul className="text-red-600 text-sm mt-2 space-y-1">
                    <li>• Prejuízo mascarado de R$ 0,50 por doce</li>
                    <li>• R$ 1.500/mês que sumem "do nada"</li>
                    <li>• Trabalha mais e lucra menos</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border-l-8 border-red-500 shadow-xl rounded-lg p-8 hover-lift animate-fade-in">
              <div className="flex items-center text-red-700 mb-4">
                <Clock className="h-8 w-8 mr-3 flex-shrink-0" />
                <h3 className="text-2xl font-black">ERRO #2: Trabalho de "Graça"</h3>
              </div>
              <div className="space-y-3">
                <p className="text-red-600 font-semibold text-lg">
                  "Só conto o ingrediente, meu trabalho não cobra..."
                </p>
                <div className="bg-red-100 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">💸 RESULTADO REAL:</p>
                  <ul className="text-red-600 text-sm mt-2 space-y-1">
                    <li>• 8h de trabalho por R$ 0,00/hora</li>
                    <li>• R$ 2.400/mês em mão de obra perdida</li>
                    <li>• Burnout e desânimo total</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border-l-8 border-red-500 shadow-xl rounded-lg p-8 hover-lift animate-fade-in">
              <div className="flex items-center text-red-700 mb-4">
                <TrendingUp className="h-8 w-8 mr-3 flex-shrink-0" />
                <h3 className="text-2xl font-black">ERRO #3: Margem Patética</h3>
              </div>
              <div className="space-y-3">
                <p className="text-red-600 font-semibold text-lg">
                  "20% de lucro tá bom, né? Pelo menos não tô perdendo..."
                </p>
                <div className="bg-red-100 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">💸 RESULTADO REAL:</p>
                  <ul className="text-red-600 text-sm mt-2 space-y-1">
                    <li>• Impossível crescer o negócio</li>
                    <li>• Qualquer imprevisto = prejuízo</li>
                    <li>• Nunca sai do vermelho de verdade</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border-l-8 border-red-500 shadow-xl rounded-lg p-8 hover-lift animate-fade-in">
              <div className="flex items-center text-red-700 mb-4">
                <FileText className="h-8 w-8 mr-3 flex-shrink-0" />
                <h3 className="text-2xl font-black">ERRO #4: Orçamento Amador</h3>
              </div>
              <div className="space-y-3">
                <p className="text-red-600 font-semibold text-lg">
                  "Mando por WhatsApp mesmo, é mais rápido..."
                </p>
                <div className="bg-red-100 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">💸 RESULTADO REAL:</p>
                  <ul className="text-red-600 text-sm mt-2 space-y-1">
                    <li>• Perde 70% das vendas grandes</li>
                    <li>• Cliente não leva a sério</li>
                    <li>• Sempre o "mais barato" da região</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-black mb-4">💰 QUANTO VOCÊ ESTÁ PERDENDO AGORA?</h3>
            <p className="text-xl mb-4">
              Se você comete apenas 2 desses erros, pode estar perdendo entre 
              <strong className="text-yellow-300"> R$ 3.000 a R$ 8.500 por mês</strong>
            </p>
            <p className="text-lg opacity-90">
              Isso são <strong>R$ 36.000 a R$ 102.000 por ano</strong> que estão vazando pelo ralo!
            </p>
          </div>
        </div>
      </section>

      {/* Nossa Solução */}
      <section id="solucao" className="py-16 sm:py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-700 rounded-full text-lg font-bold mb-6">
              <Shield className="h-5 w-5 mr-2" />
              A SOLUÇÃO DEFINITIVA CHEGOU
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              O App Mais COMPLETO
              <span className="block text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                Para Confeiteiras do Brasil
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Única ferramenta que resolve TODOS os problemas da sua confeitaria 
              em um só lugar. Testado e aprovado pelas melhores confeiteiras do país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-xl p-8 hover-lift transition-all border-2 border-transparent hover:border-green-300 animate-fade-in">
              <div className="bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Cálculo Científico de Preços</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Algoritmo exclusivo que calcula o preço EXATO considerando ingredientes, 
                mão de obra, custos fixos e margem ideal.
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-green-700 font-semibold text-sm">
                  ✨ Resultado: +60% de lucro real garantido
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 hover-lift transition-all border-2 border-transparent hover:border-blue-300 animate-fade-in">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Cake className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Receitas Inteligentes</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Base completa com +500 receitas já calculadas e sistema para 
                criar as suas próprias em segundos.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-700 font-semibold text-sm">
                  ✨ Resultado: Economiza 5h/semana de cálculos
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 hover-lift transition-all border-2 border-transparent hover:border-purple-300 animate-fade-in">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Orçamentos Profissionais</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Gere orçamentos em PDF que impressionam clientes e fecham 3x mais vendas 
                com preços 40% mais altos.
              </p>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-purple-700 font-semibold text-sm">
                  ✨ Resultado: +200% em vendas grandes
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 hover-lift transition-all border-2 border-transparent hover:border-pink-300 animate-fade-in">
              <div className="bg-gradient-to-br from-pink-400 to-pink-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <PieChart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Análises Avançadas</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Relatórios que mostram quais produtos dão mais lucro, 
                onde você está perdendo dinheiro e como otimizar tudo.
              </p>
              <div className="bg-pink-50 p-3 rounded-lg">
                <p className="text-pink-700 font-semibold text-sm">
                  ✨ Resultado: Elimina 100% dos prejuízos escondidos
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 hover-lift transition-all border-2 border-transparent hover:border-yellow-300 animate-fade-in">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Preços Sempre Atualizados</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Base de ingredientes com preços reais do mercado, 
                atualizada mensalmente para você nunca errar.
              </p>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-yellow-700 font-semibold text-sm">
                  ✨ Resultado: Preços sempre competitivos e lucrativos
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 hover-lift transition-all border-2 border-transparent hover:border-indigo-300 animate-fade-in">
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Velocidade Ninja</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Calcule o preço de qualquer receita em menos de 30 segundos. 
                Perfeito para atender clientes na hora.
              </p>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-indigo-700 font-semibold text-sm">
                  ✨ Resultado: Resposta instantânea = mais vendas
                </p>
              </div>
            </div>
          </div>

          {/* Comparação Suprema */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto border-4 border-gradient-to-r from-green-400 to-blue-500">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 mb-4">
                📊 TRANSFORMAÇÃO GARANTIDA EM 30 DIAS
              </h3>
              <p className="text-lg text-gray-600">
                Veja o que acontece quando você para de "achômetrar" e começa a calcular cientificamente
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-red-50 rounded-xl p-6 border-4 border-red-200">
                <h4 className="text-xl font-black text-red-700 mb-6 text-center">
                  ❌ SEM O DOCECALC (Situação Atual)
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-red-600 font-semibold">Preços no "achômetro"</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-red-600 font-semibold">Trabalho de graça</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-red-600 font-semibold">Margem patética (10-20%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-red-600 font-semibold">Orçamentos amadores</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-red-600 font-semibold">Prejuízos escondidos</span>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg mt-6">
                    <p className="text-red-700 font-black text-center">
                      💸 RESULTADO: Prejuízo de R$ 3.000 a R$ 8.500/mês
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border-4 border-green-200">
                <h4 className="text-xl font-black text-green-700 mb-6 text-center">
                  ✅ COM O DOCECALC (Sua Nova Realidade)
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-green-600 font-semibold">Preços científicos e precisos</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-green-600 font-semibold">Mão de obra valorizada</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-green-600 font-semibold">Margens de 50-80%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-green-600 font-semibold">Orçamentos profissionais</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-green-600 font-semibold">Lucro transparente</span>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg mt-6">
                    <p className="text-green-700 font-black text-center">
                      💰 RESULTADO: Lucro de R$ 5.000 a R$ 15.000/mês
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 rounded-full font-black text-xl shadow-xl">
                🎯 DIFERENÇA: Até R$ 23.500/mês a mais no seu bolso!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Planos */}
      <section id="planos" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Invista R$ 19,90 e Ganhe
              <span className="block text-transparent bg-gradient-to-r from-green-600 to-green-700 bg-clip-text">
                Milhares por Mês 💰
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              O investimento que se paga em menos de 1 semana e gera lucros para toda vida
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plano Free */}
            <div className="bg-white rounded-2xl shadow-xl p-8 relative hover-lift animate-fade-in border-2 border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Plano Descoberta</h3>
                <div className="text-5xl font-black text-gray-600 mb-2">GRÁTIS</div>
                <p className="text-gray-500 font-semibold">Para sempre</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">3 receitas por mês</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Calculadora básica</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Base de ingredientes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Suporte por email</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600 text-center font-semibold">
                  ✨ Ideal para testar e se apaixonar
                </p>
              </div>
              
              <Link
                to="/login"
                className="w-full py-4 px-6 rounded-xl font-bold transition-all text-center block bg-gray-100 text-gray-700 hover:bg-gray-200 text-lg"
              >
                COMEÇAR GRÁTIS
              </Link>
            </div>

            {/* Plano Pro - DESTAQUE */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative border-4 border-gradient-to-r from-green-500 to-blue-500 hover-lift animate-fade-in">
              {/* Badge de Destaque */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg">
                  🔥 MELHOR ESCOLHA - 97% PREFEREM
                </div>
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Plano Transformação</h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-2xl text-gray-400 line-through mr-3">R$ 39,90</span>
                  <div className="text-5xl font-black text-green-600">R$ 19,90</div>
                </div>
                <p className="text-gray-600 font-semibold">Por mês (50% OFF limitado)</p>
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold mt-2">
                  ⏰ Oferta expira em: {formatTime(timeLeft)}
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Receitas ILIMITADAS</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Calculadora científica completa</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">+500 receitas prontas</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Orçamentos profissionais em PDF</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Relatórios avançados</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Preços sempre atualizados</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Suporte prioritário</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Atualizações exclusivas</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6 border-2 border-green-200">
                <p className="text-center font-black text-green-700 mb-2">💰 RETORNO GARANTIDO:</p>
                <p className="text-center text-green-600 font-semibold">
                  R$ 19,90 investidos = R$ 2.000+ lucrados por mês
                </p>
                <p className="text-center text-sm text-green-500 mt-2">
                  ROI de +10.000% ao ano
                </p>
              </div>
              
              <Link
                to="/login"
                className="w-full py-4 px-6 rounded-xl font-black transition-all text-center block bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl hover-scale text-lg animate-pulse"
              >
                COMEÇAR TRANSFORMAÇÃO AGORA
              </Link>
            </div>
          </div>

          {/* Calculadora de ROI */}
          <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-4 border-yellow-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 mb-4">
                🧮 CALCULADORA DE RETORNO
              </h3>
              <p className="text-lg text-gray-700">
                Veja quanto o DoceCalc vai colocar no seu bolso
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h4 className="font-black text-gray-900 mb-3">📊 SEU INVESTIMENTO</h4>
                <div className="text-3xl font-black text-red-600 mb-2">R$ 19,90</div>
                <p className="text-gray-600 text-sm">por mês</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h4 className="font-black text-gray-900 mb-3">💰 LUCRO MÉDIO EXTRA</h4>
                <div className="text-3xl font-black text-green-600 mb-2">R$ 3.500</div>
                <p className="text-gray-600 text-sm">por mês conservador</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h4 className="font-black text-gray-900 mb-3">🎯 SEU RETORNO</h4>
                <div className="text-3xl font-black text-blue-600 mb-2">17.500%</div>
                <p className="text-gray-600 text-sm">ao ano</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-black text-xl shadow-xl">
                ⏰ Se paga em menos de 1 semana!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Garantia */}
      <section id="garantia" className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              🛡️ GARANTIA BLINDADA
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                Risco ZERO Para Você
              </span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-blue-200 animate-scale-in">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  GARANTIA AUDACIOSA DE 30 DIAS
                </h3>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl mb-8">
                <p className="text-xl text-center text-gray-800 font-bold leading-relaxed">
                  Se você não <strong className="text-blue-600">aumentar seu lucro em pelo menos 40%</strong> 
                  nos primeiros 30 dias usando o DoceCalc, nós devolvemos 
                  <strong className="text-blue-600"> 100% do seu dinheiro</strong> 
                  + pagamos <strong className="text-green-600">R$ 100,00 pela inconveniência!</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                  <h4 className="font-black text-green-700 mb-4">✅ VOCÊ GANHA SE:</h4>
                  <ul className="space-y-2 text-green-600 font-semibold">
                    <li>• Aumentar o lucro em +40%</li>
                    <li>• Economizar tempo calculando</li>
                    <li>• Fechar mais vendas</li>
                    <li>• Ter controle total dos custos</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                  <h4 className="font-black text-blue-700 mb-4">🛡️ VOCÊ GANHA SE NÃO:</h4>
                  <ul className="space-y-2 text-blue-600 font-semibold">
                    <li>• Dinheiro 100% de volta</li>
                    <li>• + R$ 100 de desculpas</li>
                    <li>• Sem perguntas incômodas</li>
                    <li>• Ficamos amigos mesmo assim</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-gray-700 mb-6 font-semibold">
                  É isso mesmo: <strong className="text-blue-600">VOCÊ NÃO PODE PERDER!</strong> 
                  Ou ganha dinheiro, ou ganha dinheiro.
                </p>
                
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-5 rounded-xl text-xl font-black hover:shadow-xl hover-scale transition-all duration-200"
                >
                  <Shield className="h-6 w-6" />
                  <span>TESTAR COM GARANTIA TOTAL</span>
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Matador */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              ❓ Objeções Destruídas
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Todas as desculpas que você vai inventar para não transformar sua vida
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 border-l-8 border-red-500 animate-fade-in">
              <h3 className="text-xl font-black text-red-700 mb-4">
                💸 "É muito caro para quem está começando..."
              </h3>
              <p className="text-red-600 font-semibold mb-4">
                MENTIRA! Se você vende pelo menos 50 docinhos por mês, o DoceCalc se paga em 1 semana. 
                E se não vende nem isso, precisa URGENTE de preços corretos!
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-green-700 font-bold">
                  ✅ VERDADE: R$ 19,90 = menos que 7 brigadeiros. Se você não consegue isso, 
                  o problema não é o preço, é que você está vendendo no prejuízo!
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 border-l-8 border-yellow-500 animate-fade-in">
              <h3 className="text-xl font-black text-yellow-700 mb-4">
                ⏰ "Não tenho tempo para aprender sistema novo..."
              </h3>
              <p className="text-yellow-600 font-semibold mb-4">
                Você tem tempo para quebrar? O DoceCalc é mais simples que WhatsApp. 
                5 minutos para cadastrar sua primeira receita.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-green-700 font-bold">
                  ✅ VERDADE: Você vai ECONOMIZAR 10 horas por semana que perde fazendo cálculo na mão.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border-l-8 border-purple-500 animate-fade-in">
              <h3 className="text-xl font-black text-purple-700 mb-4">
                👥 "Meus clientes não vão pagar preço mais alto..."
              </h3>
              <p className="text-purple-600 font-semibold mb-4">
                Seus clientes não pagam porque você apresenta como amadora! Com orçamentos profissionais 
                do DoceCalc, eles pagam 40% a mais sem reclamar.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-green-700 font-bold">
                  ✅ VERDADE: Cliente bom paga preço justo. Cliente que quer barato vai na padaria.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-8 border-l-8 border-green-500 animate-fade-in">
              <h3 className="text-xl font-black text-green-700 mb-4">
                🧮 "Eu já sei calcular, não preciso de app..."
              </h3>
              <p className="text-green-600 font-semibold mb-4">
                Se soubesse mesmo, não estaria no vermelho! 95% das confeiteiras calculam errado 
                e nem sabem. DoceCalc considera 47 variáveis que você esquece.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-green-700 font-bold">
                  ✅ VERDADE: Orgulho não paga conta. Matemática certa paga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformações Rotativas */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              🎯 Transformações Reais
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Histórias reais de confeiteiras que saíram do vermelho
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">{transformacoes[currentTestimonial].avatar}</span>
                <h3 className="text-2xl font-black text-gray-900">
                  {transformacoes[currentTestimonial].nome}
                </h3>
                <p className="text-gray-600 font-semibold">
                  {transformacoes[currentTestimonial].cidade}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-500">
                  <h4 className="font-black text-red-700 mb-3">❌ ANTES:</h4>
                  <p className="text-red-600 font-semibold">
                    {transformacoes[currentTestimonial].antes}
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                  <h4 className="font-black text-green-700 mb-3">✅ DEPOIS:</h4>
                  <p className="text-green-600 font-semibold">
                    {transformacoes[currentTestimonial].depois}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 rounded-full font-black shadow-lg">
                  ⏰ Transformação {transformacoes[currentTestimonial].tempo}
                </div>
              </div>

              {/* Indicadores */}
              <div className="flex justify-center mt-8 space-x-2">
                {transformacoes.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-pink-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Supremo */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-black mb-8 inline-block animate-pulse">
              🚨 ÚLTIMA CHANCE - OFERTA EXPIRA EM: {formatTime(timeLeft)}
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 leading-tight">
              STOP! 
              <span className="block text-yellow-300">Você Tem 2 Escolhas:</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
              <div className="bg-red-700/50 backdrop-blur-sm rounded-xl p-8 border-4 border-red-400">
                <h3 className="text-2xl font-black text-red-100 mb-6">❌ ESCOLHA #1: Continuar Como Está</h3>
                <ul className="text-red-200 text-left space-y-3 font-semibold">
                  <li>• Continue vendendo no prejuízo</li>
                  <li>• Trabalhe de graça para sempre</li>
                  <li>• Perca R$ 8.500/mês sem saber</li>
                  <li>• Quebre em 2 anos como 78%</li>
                  <li>• Viva estressada e sem dinheiro</li>
                </ul>
                <div className="mt-6 p-4 bg-red-800/50 rounded-lg">
                  <p className="text-red-100 font-black text-center">
                    💸 CUSTO: Sua confeitaria + seus sonhos
                  </p>
                </div>
              </div>

              <div className="bg-green-600/50 backdrop-blur-sm rounded-xl p-8 border-4 border-green-300">
                <h3 className="text-2xl font-black text-green-100 mb-6">✅ ESCOLHA #2: Transformar Agora</h3>
                <ul className="text-green-200 text-left space-y-3 font-semibold">
                  <li>• Preços científicos e lucrativos</li>
                  <li>• Trabalho valorizado em R$</li>
                  <li>• Lucre R$ 5.000+ por mês</li>
                  <li>• Confeitaria próspera e sólida</li>
                  <li>• Liberdade financeira real</li>
                </ul>
                <div className="mt-6 p-4 bg-green-700/50 rounded-lg">
                  <p className="text-green-100 font-black text-center">
                    💰 INVESTIMENTO: Apenas R$ 19,90/mês
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
              <h3 className="text-3xl font-black mb-6">⏰ AGIR AGORA OU NUNCA MAIS</h3>
              <p className="text-xl mb-6 leading-relaxed opacity-95">
                Esta oferta de <strong className="text-yellow-300">50% OFF</strong> expira quando o timer zerar. 
                Depois disso, volta para R$ 39,90/mês e você vai se arrepender de não ter decidido hoje.
              </p>
              <p className="text-lg opacity-90">
                <strong className="text-yellow-300">1.247 confeiteiras</strong> já transformaram suas vidas este mês. 
                Não seja a que ficou para trás assistindo as outras prosperarem.
              </p>
            </div>

            <div className="space-y-6">
              <Link
                to="/login"
                className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-6 rounded-xl text-2xl font-black hover:shadow-2xl hover-scale transition-all duration-200 animate-bounce"
              >
                <Sparkles className="h-8 w-8" />
                <span>SIM! QUERO TRANSFORMAR AGORA</span>
                <ArrowRight className="h-8 w-8" />
              </Link>
              
              <div className="text-lg opacity-90 space-y-2">
                <p>✅ Sem cartão de crédito para testar</p>
                <p>✅ Garantia blindada de 30 dias</p>
                <p>✅ Suporte premium incluso</p>
                <p>✅ Transformação em 24h</p>
              </div>

              <div className="bg-yellow-400/20 rounded-xl p-6 mt-8">
                <p className="text-yellow-200 font-black text-xl mb-2">
                  🎁 BÔNUS ESPECIAL HOJE:
                </p>
                <p className="text-white text-lg">
                  + Planilha com 100 receitas já calculadas (valor R$ 97,00) 
                  <strong className="text-yellow-300">GRÁTIS!</strong>
                </p>
              </div>
            </div>

            <div className="mt-12 text-base opacity-75 max-w-2xl mx-auto">
              <p>
                ⚠️ <strong>AVISO LEGAL:</strong> Esta página será removida em 72h. O DoceCalc está crescendo exponencialmente 
                e em breve será um produto premium exclusivo. Esta é sua última chance de entrar com desconto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Supremo */}
      <footer className="py-12 bg-gray-900 text-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <Cake className="h-10 w-10 text-pink-500" />
                <Crown className="h-5 w-5 text-yellow-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-3xl font-black">DoceCalc</span>
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                #1 BRASIL
              </div>
            </div>
            
            <p className="text-gray-300 text-lg mb-4 font-semibold">
              O app mais completo para confeiteiras do Brasil
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400 mb-6">
              <span>✅ +10.000 confeiteiras transformadas</span>
              <span>✅ +R$ 50 milhões em lucros gerados</span>
              <span>✅ 98% de satisfação</span>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                © 2024 DoceCalc. Todos os direitos reservados. 
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Feito com ❤️ e muita matemática para confeiteiras brasileiras que merecem prosperar.
              </p>
            </div>

            {/* Selo de Confiança */}
            <div className="flex justify-center items-center space-x-6 mt-6">
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold">
                🔒 100% SEGURO
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold">
                🛡️ GARANTIA 30 DIAS
              </div>
              <div className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold">
                ⭐ NOTA 4.9/5.0
              </div>
            </div>
          </div>
        </div>

        {/* Sticky CTA Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-500 to-green-600 p-4 z-50 shadow-2xl">
          <Link
            to="/login"
            className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-black text-center block hover:bg-yellow-300 transition-all animate-pulse"
          >
            🔥 TRANSFORMAR AGORA - 50% OFF
          </Link>
          <p className="text-center text-xs text-white mt-1 opacity-90">
            Expira em: {formatTime(timeLeft)}
          </p>
        </div>
      </footer>
    </div>
  )
}
