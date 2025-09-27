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
  Bot,
  Store,
  BookOpen,
  BarChart3,
  Lightbulb
} from 'lucide-react'

export default function LandingPage() {
  const [emailDemo, setEmailDemo] = useState('')
  const [showCalculatorDemo, setShowCalculatorDemo] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  const problemas = [
    {
      problema: "Não sei se estou tendo lucro real",
      consequencia: "Trabalha muito e não sobra nada no final do mês",
      solucao: "Dashboard com análise de lucro real por produto"
    },
    {
      problema: "Demoro horas calculando preços",
      consequencia: "Perde tempo que poderia estar produzindo",
      solucao: "Calculadora que resolve em 30 segundos"
    },
    {
      problema: "Clientes acham meus orçamentos caros",
      consequencia: "Perde vendas grandes por apresentação amadora",
      solucao: "Orçamentos profissionais em PDF que justificam o preço"
    },
    {
      problema: "Não sei quais receitas dão mais lucro",
      consequencia: "Foca nos produtos errados e lucra menos",
      solucao: "Relatórios que mostram quais receitas valem mais a pena"
    }
  ]

  const funcionalidades = [
    {
      icon: Calculator,
      titulo: "Calculadora Científica",
      descricao: "Calcula preço exato considerando ingredientes, mão de obra, energia, embalagem e margem de lucro",
      beneficio: "Nunca mais venda no prejuízo",
      cor: "from-green-400 to-green-600"
    },
    {
      icon: Cake,
      titulo: "Banco de Receitas + Marketplace",
      descricao: "Base completa com receitas já calculadas + acesso ao marketplace exclusivo com ebooks premium",
      beneficio: "Receitas que geram +R$ 2.000/mês",
      cor: "from-pink-400 to-pink-600"
    },
    {
      icon: FileText,
      titulo: "Orçamentos Profissionais",
      descricao: "Gera orçamentos em PDF com sua marca que impressionam e fecham mais vendas",
      beneficio: "Aumente seus preços em 40%",
      cor: "from-blue-400 to-blue-600"
    },
    {
      icon: BarChart3,
      titulo: "Relatórios Inteligentes",
      descricao: "Veja quais produtos dão mais lucro, custos por período e onde está perdendo dinheiro",
      beneficio: "Controle total do seu negócio",
      cor: "from-purple-400 to-purple-600"
    },
    {
      icon: Bot,
      titulo: "DoceBot IA",
      descricao: "Assistente com inteligência artificial para tirar dúvidas e dar sugestões personalizadas",
      beneficio: "Consultoria 24h disponível",
      cor: "from-indigo-400 to-indigo-600"
    },
    {
      icon: Users,
      titulo: "Comunidade Exclusiva",
      descricao: "Conecte-se com outras confeiteiras, troque experiências e aprenda juntas",
      beneficio: "Network que acelera resultados",
      cor: "from-yellow-400 to-yellow-600"
    }
  ]

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

  const transformacoes = [
    {
      nome: "Maria Silva",
      cidade: "São Paulo - SP",
      antes

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Cake className="h-8 w-8 text-pink-500" />
              <Crown className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold text-gray-900">DoceCalc</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#problemas" className="text-gray-600 hover:text-pink-500 transition-colors">
              Problemas
            </a>
            <a href="#solucao" className="text-gray-600 hover:text-pink-500 transition-colors">
              Solução
            </a>
            <a href="#planos" className="text-gray-600 hover:text-pink-500 transition-colors">
              Preços
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
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
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
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <a 
                href="#problemas" 
                className="block text-gray-600 hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Problemas
              </a>
              <a 
                href="#solucao" 
                className="block text-gray-600 hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Solução
              </a>
              <a 
                href="#planos" 
                className="block text-gray-600 hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preços
              </a>
              <div className="border-t pt-4">
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

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 to-purple-100/20"></div>
        <div className="container mx-auto text-center max-w-5xl relative">
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Pare de Vender
            <span className="block text-transparent bg-gradient-to-r from-red-600 to-red-700 bg-clip-text"> no Prejuízo!</span>
            <span className="text-3xl sm:text-4xl lg:text-5xl">Descubra seus preços REAIS</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            O DoceCalc é o <strong className="text-pink-600">app mais completo do Brasil</strong> para confeiteiras que querem 
            <strong className="text-purple-600"> calcular preços corretos, organizar o negócio e aumentar o lucro</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-5 rounded-lg text-xl font-black hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <Sparkles className="h-6 w-6" />
              <span>COMEÇAR GRATUITAMENTE</span>
              <ArrowRight className="h-6 w-6" />
            </Link>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">✓ Sem cartão ✓ 5 receitas grátis</div>
              <div className="text-sm font-bold text-green-600">Resultados imediatos!</div>
            </div>
          </div>

          {/* Preview do App */}
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto border-2 border-green-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6">O que você vai ter acesso:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <Calculator className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Calculadora Científica</h4>
                <p className="text-sm text-gray-600">Calcula TODOS os custos reais</p>
              </div>
              
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-pink-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Ebooks Exclusivos</h4>
                <p className="text-sm text-gray-600">Receitas que faturam +R$ 2k/mês</p>
              </div>
              
              <div className="text-center">
                <FileText className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Orçamentos Profissionais</h4>
                <p className="text-sm text-gray-600">PDFs que impressionam clientes</p>
              </div>
              
              <div className="text-center">
                <Bot className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">DoceBot IA</h4>
                <p className="text-sm text-gray-600">Assistente inteligente 24h</p>
              </div>
              
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Relatórios Avançados</h4>
                <p className="text-sm text-gray-600">Saiba exatamente onde lucrar mais</p>
              </div>
              
              <div className="text-center">
                <Users className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Comunidade</h4>
                <p className="text-sm text-gray-600">Network com outras confeiteiras</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção dos Problemas */}
      <section id="problemas" className="py-16 sm:py-20 bg-red-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-700 mb-6">
              Estes erros estão custando CARO
            </h2>
            <p className="text-xl sm:text-2xl text-red-600 max-w-3xl mx-auto font-bold">
              Reconhece algum desses problemas?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {problemas.map((item, index) => (
              <div key={index} className="bg-white border-l-8 border-red-500 shadow-xl rounded-lg p-8 hover:shadow-2xl transition-shadow">
                <h3 className="text-xl font-black text-red-700 mb-4">
                  "{item.problema}"
                </h3>
                <div className="space-y-4">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-red-700 font-bold mb-2">💸 CONSEQUÊNCIA:</p>
                    <p className="text-red-600">{item.consequencia}</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-green-700 font-bold mb-2">✅ SOLUÇÃO NO DOCECALC:</p>
                    <p className="text-green-600 font-semibold">{item.solucao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-black mb-4">💰 QUANTO ISSO CUSTA?</h3>
            <p className="text-xl mb-4">
              Calcular errado pode estar custando <strong className="text-yellow-300">centenas ou milhares por mês</strong> sem você perceber
            </p>
            <p className="text-lg opacity-90">
              O DoceCalc resolve TODOS esses problemas por <strong>apenas R$ 19,90/mês</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Nossa Solução */}
      <section id="solucao" className="py-16 sm:py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              6 Ferramentas Poderosas
              <span className="block text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                em um Só App
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Tudo que você precisa para transformar sua confeitaria em um negócio próspero e organizado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {funcionalidades.map((func, index) => (
              <div key={index} className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition-all border-2 border-transparent hover:border-green-300">
                <div className={`bg-gradient-to-br ${func.cor} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                  <func.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{func.titulo}</h3>
                <p className="text-gray-600 mb-4 text-sm">{func.descricao}</p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-700 font-semibold text-sm">
                    ✨ {func.beneficio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Destaque dos Ebooks */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              🎯 MARKETPLACE EXCLUSIVO INCLUSO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white/90 rounded-lg p-6">
                <h4 className="font-black text-gray-900 mb-3">📚 Ebooks Exclusivos</h4>
                <p className="text-gray-700 mb-3">Acesse receitas premium como chocolates gourmet que vendem por R$ 8-15 cada</p>
                <p className="text-green-600 font-bold">Potencial: +R$ 1.500/mês</p>
              </div>
              <div className="bg-white/90 rounded-lg p-6">
                <h4 className="font-black text-gray-900 mb-3">🍩 Receitas Exclusivas</h4>
                <p className="text-gray-700 mb-3">Mini donuts e outras tendências que só encontra dentro do app</p>
                <p className="text-green-600 font-bold">Potencial: +R$ 800/mês</p>
              </div>
            </div>
            <p className="text-gray-900 font-bold text-lg mt-6">
              💰 Total: Marketplace com receitas que podem gerar +R$ 2.300/mês extras
            </p>
          </div>
        </div>
      </section>

      {/* Seção de Planos */}
      <section id="planos" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Teste GRÁTIS por 7 Dias
              <span className="block text-transparent bg-gradient-to-r from-green-600 to-green-700 bg-clip-text">
                Depois apenas R$ 19,90/mês
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Acesso completo para testar todas as funcionalidades sem compromisso
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative border-4 border-gradient-to-r from-green-500 to-blue-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg">
                  🔥 TESTE COMPLETO - 7 DIAS GRÁTIS
                </div>
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Acesso Total DoceCalc</h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-2xl text-gray-400 line-through mr-3">R$ 0,00</span>
                  <div className="text-5xl font-black text-green-600">R$ 19,90</div>
                </div>
                <p className="text-gray-600 font-semibold">7 dias grátis, depois R$ 19,90/mês</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Receitas ILIMITADAS</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Ingredientes ilimitados</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Calculadora ilimitada</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">100 créditos DoceBot IA/mês</span>
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
                  <span className="text-gray-700 font-medium">Gestão financeira completa</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Catálogo personalizado</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Marketplace exclusivo</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Comunidade completa</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6 border-2 border-green-200">
                <p className="text-center font-black text-green-700 mb-2">💰 GARANTIA TOTAL:</p>
                <p className="text-center text-green-600 font-semibold">
                  Teste por 7 dias. Se não gostar, cancele sem pagar nada
                </p>
              </div>
              
              <Link
                to="/login"
                className="w-full py-4 px-6 rounded-xl font-black transition-all text-center block bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl hover:scale-105 text-lg"
              >
                COMEÇAR TESTE GRÁTIS DE 7 DIAS
              </Link>

              <p className="text-center text-sm text-gray-500 mt-4">
                ✓ Sem cartão necessário para começar ✓ Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transformações Rotativas */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              🎯 Transformações Reais
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Histórias reais de confeiteiras que saíram do vermelho
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
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
      </section><p className="text-sm text-gray-600">
                É risco zero para você conhecer todas as funcionalidades
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final com Bifurcação */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 leading-tight">
              VOCÊ TEM 2 CAMINHOS:
              <span className="block text-yellow-300">Qual Vai Escolher?</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
              <div className="bg-red-700/50 backdrop-blur-sm rounded-xl p-8 border-4 border-red-400">
                <h3 className="text-2xl font-black text-red-100 mb-6">❌ CAMINHO #1: Continuar Como Está</h3>
                <ul className="text-red-200 text-left space-y-3 font-semibold">
                  <li>• Continue calculando no "achômetro"</li>
                  <li>• Trabalhe de graça para sempre</li>
                  <li>• Perca dinheiro sem saber onde</li>
                  <li>• Venda mais barato que a concorrência</li>
                  <li>• Viva estressada e sem controle</li>
                  <li>• Sonhe com um dia "dar certo"</li>
                </ul>
                <div className="mt-6 p-4 bg-red-800/50 rounded-lg">
                  <p className="text-red-100 font-black text-center">
                    💸 RESULTADO: Mais um ano no vermelho
                  </p>
                </div>
              </div>

              <div className="bg-green-600/50 backdrop-blur-sm rounded-xl p-8 border-4 border-green-300">
                <h3 className="text-2xl font-black text-green-100 mb-6">✅ CAMINHO #2: Transformar AGORA</h3>
                <ul className="text-green-200 text-left space-y-3 font-semibold">
                  <li>• Calcule preços científicos e corretos</li>
                  <li>• Valorize seu trabalho em reais</li>
                  <li>• Saiba exatamente onde está lucrando</li>
                  <li>• Cobre preços justos com segurança</li>
                  <li>• Tenha controle total do negócio</li>
                  <li>• Realize o sonho de prosperar</li>
                </ul>
                <div className="mt-6 p-4 bg-green-700/50 rounded-lg">
                  <p className="text-green-100 font-black text-center">
                    💰 RESULTADO: Confeitaria próspera e lucrativa
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
              <h3 className="text-3xl font-black mb-6">⏰ A DECISÃO É SUA</h3>
              <p className="text-xl mb-6 leading-relaxed opacity-95">
                Cada dia que passa calculando errado é <strong className="text-yellow-300">dinheiro deixado na mesa</strong>. 
                Enquanto você pensa "mais tarde eu vejo isso", outras confeiteiras estão usando o DoceCalc 
                e <strong className="text-yellow-300">aumentando seus lucros todos os dias</strong>.
              </p>
              <p className="text-lg opacity-90">
                A pergunta não é "se" você vai mudar. É <strong className="text-yellow-300">"quando"</strong>.
                Por que não hoje?
              </p>
            </div>

            <div className="space-y-6">
              <Link
                to="/login"
                className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-6 rounded-xl text-2xl font-black hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                <Sparkles className="h-8 w-8" />
                <span>ESCOLHO O SUCESSO - TESTAR 7 DIAS GRÁTIS</span>
                <ArrowRight className="h-8 w-8" />
              </Link>
              
              <div className="text-lg opacity-90 space-y-2">
                <p>✓ 7 dias grátis para testar tudo</p>
                <p>✓ Sem cartão necessário para começar</p>
                <p>✓ Cancele quando quiser, sem pegadinhas</p>
                <p>✓ Suporte completo incluso</p>
              </div>

              <div className="bg-yellow-400/20 rounded-xl p-6 mt-8 max-w-2xl mx-auto">
                <p className="text-yellow-200 font-black text-lg mb-2">
                  💡 Lembre-se:
                </p>
                <p className="text-white">
                  Você não pode mudar o passado, mas pode transformar seu futuro. 
                  <strong className="text-yellow-300">Comece hoje</strong> e daqui 30 dias agradeça a si mesma por ter tomado esta decisão.
                </p>
              </div>
            </div>

            <div className="mt-12 text-base opacity-75 max-w-2xl mx-auto">
              <p>
                <strong>Mais de 800 confeiteiras</strong> já escolheram o caminho do sucesso este mês. 
                Não fique para trás assistindo outras prosperarem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
              Dúvidas Frequentes
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Respondemos as principais perguntas sobre o DoceCalc
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-green-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Como funciona o plano gratuito?
              </h3>
              <p className="text-gray-700">
                Você tem acesso permanente a 5 receitas, 15 ingredientes, 3 cálculos por mês e 5 consultas à IA. 
                É suficiente para conhecer o app e ver os resultados. Quando quiser mais, faz upgrade.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-blue-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                O app é difícil de usar?
              </h3>
              <p className="text-gray-700">
                Não! Foi feito pensando em confeiteiras, não em programadores. É intuitivo como WhatsApp. 
                Em 5 minutos você já consegue calcular sua primeira receita.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-purple-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Os ebooks realmente ajudam a faturar mais?
              </h3>
              <p className="text-gray-700">
                Sim! São receitas testadas e aprovadas, com foco em produtos que têm alta margem de lucro e demanda. 
                Chocolate gourmet e mini donuts são tendências que vendem bem e têm preço premium.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-pink-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-700">
                Claro! Não tem fidelidade. Cancela quando quiser pelo próprio app. E ainda tem 7 dias de garantia 
                para teste do plano profissional.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-yellow-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Funciona para qualquer tipo de doce?
              </h3>
              <p className="text-gray-700">
                Sim! A calculadora funciona para bolos, docinhos, tortas, salgados, chocolates, biscoitos... 
                Qualquer receita que tenha ingredientes e tempo de preparo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <Cake className="h-10 w-10 text-pink-500" />
                <Crown className="h-5 w-5 text-yellow-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-3xl font-black">DoceCalc</span>
            </div>
            
            <p className="text-gray-300 text-lg mb-6 font-semibold">
              O app mais completo para confeiteiras do Brasil
            </p>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                © 2024 DoceCalc. Todos os direitos reservados. 
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Feito com amor para confeiteiras que merecem prosperar.
              </p>
            </div>

            <div className="flex justify-center items-center space-x-6 mt-6">
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold">
                🔒 100% SEGURO
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold">
                🛡️ GARANTIA 7 DIAS
              </div>
            </div>
          </div>
        </div>

        {/* Sticky CTA Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-500 to-green-600 p-4 z-50 shadow-2xl">
          <Link
            to="/login"
            className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-black text-center block hover:bg-yellow-300 transition-all"
          >
            COMEÇAR GRÁTIS AGORA
          </Link>
        </div>
      </footer>
    </div>
  )
}