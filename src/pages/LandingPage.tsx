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
      titulo: "Gestão de Receitas",
      descricao: "Cadastre e organize todas suas receitas com cálculos automáticos de custo e preço",
      beneficio: "Receitas sempre organizadas",
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
      titulo: "Relatórios Financeiros",
      descricao: "Controle completo de vendas, gastos, lucros e veja onde está perdendo dinheiro",
      beneficio: "Controle total do negócio",
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
    },
    {
      icon: Store,
      titulo: "Marketplace de Ebooks",
      descricao: "Acesso a ebooks premium com receitas de alta margem como chocolates gourmet e mini donuts",
      beneficio: "Receitas que faturam +R$ 2.000/mês",
      cor: "from-orange-400 to-orange-600"
    },
    {
      icon: Target,
      titulo: "Catálogo Personalizado",
      descricao: "Crie seu catálogo digital com fotos, preços e link compartilhável para clientes",
      beneficio: "Venda mais profissionalmente",
      cor: "from-cyan-400 to-cyan-600"
    }
  ]

  const depoimentos = [
    {
      nome: "Maria Silva",
      cidade: "São Paulo - SP",
      foto: "👩‍🍳",
      depoimento: "Descobri que estava vendendo brigadeiros com apenas 20% de lucro. Agora trabalho com 60% e faturei R$ 3.200 no último mês!",
      resultado: "Lucro aumentou 200%"
    },
    {
      nome: "Ana Costa",
      cidade: "Rio de Janeiro - RJ", 
      foto: "👩‍💼",
      depoimento: "Os orçamentos em PDF me ajudaram a fechar contratos de R$ 1.500 que antes eu perdia. Meus clientes ficam impressionados!",
      resultado: "Fechou contratos grandes"
    },
    {
      nome: "Carla Oliveira",
      cidade: "Belo Horizonte - MG",
      foto: "👩",
      depoimento: "O ebook de chocolates mudou minha vida. Vendo 50 chocolates por semana a R$ 12 cada. É minha fonte de renda principal!",
      resultado: "R$ 2.400/mês extras"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % depoimentos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
              8 Ferramentas Poderosas
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

          {/* Marketplace dos Ebooks */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              🏪 MARKETPLACE EXCLUSIVO
            </h3>
            <p className="text-gray-900 font-bold text-lg mb-6">
              Acesse ebooks premium com receitas de alta margem de lucro
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white/90 rounded-lg p-6">
                <h4 className="font-black text-gray-900 mb-3">📚 Ebook: Chocolates Gourmet</h4>
                <p className="text-gray-700 mb-3">Receitas premium que vendem por R$ 8-15 cada</p>
                <p className="text-green-600 font-bold">Potencial: +R$ 1.500/mês</p>
              </div>
              <div className="bg-white/90 rounded-lg p-6">
                <h4 className="font-black text-gray-900 mb-3">🍩 Ebook: Mini Donuts</h4>
                <p className="text-gray-700 mb-3">Trend que vende R$ 3-5 cada, alta margem</p>
                <p className="text-green-600 font-bold">Potencial: +R$ 800/mês</p>
              </div>
            </div>
            <p className="text-gray-900 font-bold text-lg mt-6">
              💰 Total: Receitas disponíveis que podem gerar +R$ 2.300/mês extras
            </p>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Resultados Reais de
              <span className="block text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                Confeiteiras como Você
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Veja como outras confeiteiras transformaram seus negócios com o DoceCalc
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center relative">
              <div className="text-6xl mb-4">{depoimentos[currentTestimonial].foto}</div>
              
              <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                "{depoimentos[currentTestimonial].depoimento}"
              </blockquote>
              
              <div className="mb-4">
                <h4 className="text-lg font-black text-gray-900">{depoimentos[currentTestimonial].nome}</h4>
                <p className="text-gray-600">{depoimentos[currentTestimonial].cidade}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
                <p className="text-green-700 font-black">
                  💰 Resultado: {depoimentos[currentTestimonial].resultado}
                </p>
              </div>
              
              <div className="flex justify-center space-x-2 mt-8">
                {depoimentos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial 
                        ? 'bg-purple-500' 
                        : 'bg-gray-300 hover:bg-purple-300'
                    }`}
                  />
                ))}
              </div>
            </div>
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
                Acesso Total ao App 💰
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Use todas as 8 ferramentas sem limitações durante sua semana de teste
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Plano Único */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative border-4 border-green-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg">
                  🔥 TESTE GRÁTIS 7 DIAS
                </div>
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className="text-2xl font-black text-gray-900 mb-4">DoceCalc Profissional</h3>
                <div className="text-5xl font-black text-green-600 mb-2">R$ 19,90</div>
                <p className="text-gray-600 font-semibold">Por mês (após o teste grátis)</p>
                <p className="text-sm text-gray-500 mt-2">✨ Primeiros 7 dias: 100% GRATUITO</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Calculadora científica ILIMITADA</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Receitas e ingredientes ilimitados</span>
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
                  <span className="text-gray-700 font-medium">Relatórios financeiros completos</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Catálogo digital personalizado</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Marketplace de ebooks premium</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Comunidade exclusiva</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6 border-2 border-green-200">
                <p className="text-center font-black text-green-700 mb-2">🎯 TESTE COMPLETO:</p>
                <p className="text-center text-green-600 font-semibold mb-2">
                  7 dias para usar TODAS as ferramentas
                </p>
                <p className="text-center text-sm text-gray-600">
                  Cancele antes dos 7 dias e não pague nada
                </p>
              </div>
              
              <Link
                to="/login"
                className="w-full py-4 px-6 rounded-xl font-black transition-all text-center block bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl hover:scale-105 text-lg mb-4"
              >
                COMEÇAR TESTE GRÁTIS AGORA
              </Link>

              <div className="text-center text-sm text-gray-500 space-y-1">
                <p>✓ Sem cartão de crédito para começar</p>
                <p>✓ Cancele quando quiser</p>
                <p>✓ Acesso total por 7 dias</p>
              </div>
            </div>
          </div>

          {/* Garantia */}
          <div className="max-w-4xl mx-auto mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-4 border-blue-200">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">
                🛡️ Garantia Total de Satisfação
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Teste por 7 dias gratuitamente. Se não ficar satisfeito após começar a pagar, 
                devolvemos 100% do seu dinheiro nos primeiros 30 dias.
              </p>
              <p className="text-sm text-gray-600">
                Risco ZERO para você conhecer todas as funcionalidades
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bifurcação - Negativo vs Positivo */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Você Tem 2 Caminhos Agora
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              A escolha é sua. Qual caminho vai seguir?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Caminho Negativo */}
            <div className="bg-white border-l-8 border-red-500 shadow-xl rounded-lg p-8">
              <div className="text-center mb-6">
                <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-red-700 mb-4">
                  Caminho 1: Continuar Como Está
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">❌ Continuar calculando "no olhômetro"</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">❌ Trabalhar muito e sobrar pouco</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">❌ Perder vendas com orçamentos amadores</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">❌ Nunca saber se está lucrando de verdade</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">❌ Ficar sempre na mesma situação</p>
                </div>
              </div>

              <div className="bg-red-100 border border-red-300 p-6 rounded-lg mt-6">
                <p className="text-red-800 font-black text-center">
                  💸 RESULTADO: Continuar perdendo dinheiro sem perceber
                </p>
              </div>
            </div>

            {/* Caminho Positivo */}
            <div className="bg-white border-l-8 border-green-500 shadow-xl rounded-lg p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-black">
                  🏆 CAMINHO INTELIGENTE
                </div>
              </div>

              <div className="text-center mb-6 mt-4">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-green-700 mb-4">
                  Caminho 2: Testar o DoceCalc Grátis
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-bold">✅ Calcular preços cientificamente corretos</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-bold">✅ Ter certeza do seu lucro real</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-bold">✅ Impressionar clientes com orçamentos profissionais</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-bold">✅ Acessar receitas que faturam +R$ 2.000/mês</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-bold">✅ Ter uma IA te ajudando 24/7</p>
                </div>
              </div>

              <div className="bg-green-100 border border-green-300 p-6 rounded-lg mt-6">
                <p className="text-green-800 font-black text-center mb-2">
                  💰 RESULTADO: Negócio próspero e organizado
                </p>
                <p className="text-green-700 text-center font-semibold">
                  Teste 7 dias GRÁTIS - Sem compromisso
                </p>
              </div>

              <Link
                to="/login"
                className="w-full mt-6 py-4 px-6 rounded-xl font-black transition-all text-center block bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl hover:scale-105 text-lg"
              >
                ESCOLHER O CAMINHO INTELIGENTE
              </Link>
            </div>
          </div>

          <div className="text-center mt-12 max-w-3xl mx-auto">
            <div className="bg-yellow-100 border border-yellow-400 p-6 rounded-xl">
              <p className="text-yellow-800 font-black text-lg mb-2">
                ⏰ MOMENTO DA DECISÃO
              </p>
              <p className="text-yellow-700">
                Cada dia que passa sem saber seus custos reais é dinheiro perdido. 
                Você pode continuar como está ou dar o primeiro passo para um negócio mais lucrativo. 
                <strong>A escolha é sua.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black mb-8">
              Sua Confeitaria Merece 
              <span className="block text-yellow-300">Preços Justos e Lucro Real</span>
            </h2>
            
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Pare de trabalhar de graça. Pare de vender no prejuízo. 
              <strong className="text-yellow-300">Comece a cobrar o que vale</strong> e 
              transforme sua paixão em um negócio próspero.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 max-w-3xl mx-auto">
              <h3 className="text-2xl font-black mb-6">O que você ganha HOJE:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Calculadora que calcula TUDO</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Ebooks com receitas que vendem</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Orçamentos que impressionam</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Relatórios que mostram onde lucrar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">IA que te ajuda 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Comunidade de confeiteiras</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Link
                to="/login"
                className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-6 rounded-xl text-2xl font-black hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                <Sparkles className="h-8 w-8" />
                <span>COMEÇAR GRÁTIS AGORA</span>
                <ArrowRight className="h-8 w-8" />
              </Link>
              
              <div className="text-lg opacity-90 space-y-2">
                <p>✓ Sem cartão de crédito para começar</p>
                <p>✓ 5 receitas grátis para sempre</p>
                <p>✓ Upgrade apenas quando quiser</p>
                <p>✓ Garantia de 7 dias no plano pago</p>
              </div>

              <div className="bg-yellow-400/20 rounded-xl p-6 mt-8 max-w-2xl mx-auto">
                <p className="text-yellow-200 font-black text-lg mb-2">
                  💡 Lembre-se:
                </p>
                <p className="text-white">
                  Cada dia que passa calculando errado é dinheiro deixado na mesa. 
                  <strong className="text-yellow-300">Comece hoje mesmo</strong> e veja a diferença já na próxima venda.
                </p>
              </div>
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
                Como funciona o teste grátis de 7 dias?
              </h3>
              <p className="text-gray-700">
                Você tem acesso completo a todas as 11 ferramentas por 7 dias sem pagar nada. 
                Não precisa cartão de crédito para começar. Após os 7 dias, se quiser continuar, aí sim começa a cobrança de R$ 19,90/mês.
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
                Os ebooks do marketplace realmente ajudam a faturar mais?
              </h3>
              <p className="text-gray-700">
                Sim! São receitas testadas e aprovadas, com foco em produtos que têm alta margem de lucro e demanda. 
                Chocolate gourmet e mini donuts são tendências que vendem bem e têm preço premium.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-pink-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Posso cancelar durante o teste grátis?
              </h3>
              <p className="text-gray-700">
                Claro! Se cancelar antes dos 7 dias, não paga nada. Depois disso, não tem fidelidade - 
                cancela quando quiser pelo próprio app. E ainda tem 30 dias de garantia.
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

            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-indigo-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Como funciona o DoceBot IA?
              </h3>
              <p className="text-gray-700">
                É um assistente inteligente que responde dúvidas sobre confeitaria, sugere melhorias em receitas, 
                ajuda com precificação e dá dicas personalizadas para o seu negócio. Disponível 24 horas durante seu teste e assinatura.
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