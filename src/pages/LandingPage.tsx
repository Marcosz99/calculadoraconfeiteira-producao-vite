import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PixelService } from '../services/pixelService'
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
  Lightbulb,
  Heart
} from 'lucide-react'

export default function LandingPage() {
  const [emailDemo, setEmailDemo] = useState('')
  const [showCalculatorDemo, setShowCalculatorDemo] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  const problemas = [
    {
      problema: "Faço doce mas no fim do mês não sobra nada",
      consequencia: "Trabalha muito, vende barato e não consegue pagar as contas",
      solucao: "Descubra quanto cobrar para realmente lucrar"
    },
    {
      problema: "Não sei se meu preço está certo",
      consequencia: "Clientes reclamam que é caro, mas você mal lucra",
      solucao: "Calculadora mostra o preço justo que dá lucro real"
    },
    {
      problema: "Quero vender mais mas não sei como",
      consequencia: "Fica limitada a vender só para conhecidos",
      solucao: "Comunidade com 4.200 mulheres compartilhando dicas"
    },
    {
      problema: "Não sei quais doces dão mais dinheiro",
      consequencia: "Faz o que sabe, mas poderia ganhar 3x mais",
      solucao: "Receitas validadas que faturam +R$ 2.000/mês"
    }
  ]

  const funcionalidades = [
    {
      icon: Calculator,
      titulo: "Calculadora Simples",
      descricao: "Descubra quanto cobrar em cada doce para ter lucro de verdade, considerando tudo que você gasta",
      beneficio: "Nunca mais venda barato demais",
      cor: "from-green-400 to-green-600"
    },
    {
      icon: BookOpen,
      titulo: "Receitas que Vendem",
      descricao: "Acesse receitas testadas de chocolates gourmet e mini donuts que podem gerar até R$ 2.300/mês",
      beneficio: "Produtos que os clientes amam",
      cor: "from-pink-400 to-pink-600"
    },
    {
      icon: Users,
      titulo: "Comunidade de 4.200+ Mulheres",
      descricao: "Troque experiências, tire dúvidas e aprenda com outras mulheres que também vendem doces",
      beneficio: "Você não está sozinha",
      cor: "from-yellow-400 to-yellow-600"
    },
    {
      icon: Target,
      titulo: "Seu Catálogo Digital",
      descricao: "Mostre seus doces de forma bonita com link compartilhável no WhatsApp",
      beneficio: "Venda mais e melhor",
      cor: "from-cyan-400 to-cyan-600"
    },
    {
      icon: Bot,
      titulo: "Assistente Inteligente",
      descricao: "Tire dúvidas sobre receitas, preços e vendas a qualquer hora com nossa IA",
      beneficio: "Ajuda sempre que precisar",
      cor: "from-indigo-400 to-indigo-600"
    },
    {
      icon: FileText,
      titulo: "Orçamentos Bonitos",
      descricao: "Envie orçamentos organizados que impressionam e ajudam a fechar mais vendas",
      beneficio: "Pareça mais profissional",
      cor: "from-blue-400 to-blue-600"
    },
    {
      icon: BarChart3,
      titulo: "Controle suas Vendas",
      descricao: "Veja quanto vendeu, quanto gastou e quanto realmente lucrou no mês",
      beneficio: "Saiba para onde vai seu dinheiro",
      cor: "from-purple-400 to-purple-600"
    },
    {
      icon: Cake,
      titulo: "Organize suas Receitas",
      descricao: "Tenha todas suas receitas salvas com os custos já calculados",
      beneficio: "Tudo em um só lugar",
      cor: "from-orange-400 to-orange-600"
    }
  ]

  const depoimentos = [
    {
      nome: "Ana Paula",
      cidade: "São Paulo - SP",
      foto: "👩",
      depoimento: "Comecei fazendo brigadeiro em casa para ajudar nas contas. Com o DoceCalc descobri que podia cobrar mais e ganhar R$ 1.500 por mês!",
      resultado: "R$ 1.500/mês de renda extra"
    },
    {
      nome: "Juliana Santos",
      cidade: "Rio de Janeiro - RJ", 
      foto: "👩‍🦰",
      depoimento: "Fazia doce mas mal sobrava dinheiro. A calculadora me mostrou meus erros. Hoje lucro R$ 2.400/mês e ajudo em casa!",
      resultado: "R$ 2.400/mês extras"
    },
    {
      nome: "Mariana Costa",
      cidade: "Belo Horizonte - MG",
      foto: "👩‍🦱",
      depoimento: "As receitas do marketplace mudaram minha vida. Chocolates gourmet vendem muito! Consigo pagar minhas contas e ainda sobra.",
      resultado: "Conquistou independência financeira"
    }
  ]

  useEffect(() => {
    PixelService.trackViewContent()
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % depoimentos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleTesteGratisClick = () => {
    PixelService.trackLead()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Cake className="h-8 w-8 text-pink-500" />
              <Heart className="h-4 w-4 text-red-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-2xl font-bold text-gray-900">DoceCalc</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#problemas" className="text-gray-600 hover:text-pink-500 transition-colors">
              Como Funciona
            </a>
            <a href="#solucao" className="text-gray-600 hover:text-pink-500 transition-colors">
              Benefícios
            </a>
            <a href="#planos" className="text-gray-600 hover:text-pink-500 transition-colors">
              Preço
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
              onClick={handleTesteGratisClick}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
            >
              COMEÇAR AGORA
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
                Como Funciona
              </a>
              <a 
                href="#solucao" 
                className="block text-gray-600 hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefícios
              </a>
              <a 
                href="#planos" 
                className="block text-gray-600 hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preço
              </a>
              <div className="border-t pt-4">
                <Link
                  to="/login"
                  className="block text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  COMEÇAR AGORA
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
            Ganhe até R$ 3.000 extras
            <span className="block text-transparent bg-gradient-to-r from-green-600 to-green-700 bg-clip-text"> Fazendo Doces em Casa</span>
            <span className="text-3xl sm:text-4xl lg:text-5xl">Mesmo sendo iniciante</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            O DoceCalc é o <strong className="text-pink-600">app mais usado por 1200+ mulheres</strong> que querem 
            <strong className="text-purple-600"> ganhar renda extra fazendo docinhos - do jeito certo e lucrativo</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/login"
              onClick={handleTesteGratisClick}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-5 rounded-lg text-xl font-black hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <Sparkles className="h-6 w-6" />
              <span>QUERO GANHAR RENDA EXTRA</span>
              <ArrowRight className="h-6 w-6" />
            </Link>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1"></div>
              <div className="text-sm font-bold text-green-600">Comece hoje mesmo!</div>
            </div>
          </div>

          {/* Preview do App */}
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto border-2 border-green-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6">O que você vai ter:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <Calculator className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Calculadora Fácil</h4>
                <p className="text-sm text-gray-600">Descubra quanto cobrar</p>
              </div>
              
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-pink-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Receitas que Vendem</h4>
                <p className="text-sm text-gray-600">Produtos de alta margem</p>
              </div>
              
              <div className="text-center">
                <Users className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">4.200+ Mulheres</h4>
                <p className="text-sm text-gray-600">Comunidade de apoio</p>
              </div>
              
              <div className="text-center">
                <Bot className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Ajuda Inteligente</h4>
                <p className="text-sm text-gray-600">IA que responde dúvidas</p>
              </div>
              
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Controle de Vendas</h4>
                <p className="text-sm text-gray-600">Veja seu lucro real</p>
              </div>
              
              <div className="text-center">
                <FileText className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Orçamentos Bonitos</h4>
                <p className="text-sm text-gray-600">Impressione clientes</p>
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
              Por que você NÃO está ganhando o que merece?
            </h2>
            <p className="text-xl sm:text-2xl text-red-600 max-w-3xl mx-auto font-bold">
              Se reconhece em alguma dessas situações?
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
                    <p className="text-red-700 font-bold mb-2">💸 O QUE ACONTECE:</p>
                    <p className="text-red-600">{item.consequencia}</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-green-700 font-bold mb-2">✅ SOLUÇÃO:</p>
                    <p className="text-green-600 font-semibold">{item.solucao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-black mb-4">💰 VOCÊ MERECE GANHAR MAIS</h3>
            <p className="text-xl mb-4">
              Fazer doce para vender deveria <strong className="text-yellow-300">ajudar você a pagar suas contas</strong>, não só dar trabalho
            </p>
            <p className="text-lg opacity-90">
              Com o DoceCalc você aprende a cobrar o preço certo e ganhar de verdade
            </p>
          </div>
        </div>
      </section>

      {/* Nossa Solução */}
      <section id="solucao" className="py-16 sm:py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Tudo que Você Precisa
              <span className="block text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                para Ganhar Renda Extra com Doces
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Simples, fácil de usar e feito para quem está começando ou quer vender mais
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
              🏪 RECEITAS QUE REALMENTE VENDEM
            </h3>
            <p className="text-gray-900 font-bold text-lg mb-6">
              Aprenda a fazer doces que os clientes amam e pagam bem
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white/90 rounded-lg p-6">
                <h4 className="font-black text-gray-900 mb-3">📚 Chocolates Gourmet</h4>
                <p className="text-gray-700 mb-3">Receitas premium que vendem por R$ 8-15 cada</p>
                <p className="text-green-600 font-bold">Você pode ganhar: +R$ 1.500/mês</p>
              </div>
              <div className="bg-white/90 rounded-lg p-6">
                <h4 className="font-black text-gray-900 mb-3">🍩 Mini Donuts</h4>
                <p className="text-gray-700 mb-3">Trend que vende R$ 3-5 cada, todo mundo adora</p>
                <p className="text-green-600 font-bold">Você pode ganhar: +R$ 800/mês</p>
              </div>
            </div>
            <p className="text-gray-900 font-bold text-lg mt-6">
              💰 Potencial total: +R$ 2.300/mês de renda extra
            </p>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Mulheres como Você
              <span className="block text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                Conquistando Renda Extra
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Veja como elas estão ganhando dinheiro fazendo doces em casa
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
              Comece a Ganhar Hoje
              <span className="block text-transparent bg-gradient-to-r from-green-600 to-green-700 bg-clip-text">
                Teste agora mesmo!
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Caso não goste seu dinheiro devolta!
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Plano Único */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative border-4 border-green-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg">
                  🔥 TESTE AGORA MESMO!
                </div>
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Acesso Completo</h3>
                <div className="text-5xl font-black text-green-600 mb-2">R$ 19,90</div>
                <p className="text-gray-600 font-semibold">Por mês (só paga após o teste)</p>
                <p className="text-sm text-gray-500 mt-2">✨ Uma semana GRÁTIS para testar tudo</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Calculadora para saber quanto cobrar</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Receitas de chocolates e mini donuts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Comunidade com 4.200+ mulheres</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Assistente inteligente 24h</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Orçamentos bonitos em PDF</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Controle de vendas e lucro</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Catálogo digital para WhatsApp</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Organize todas suas receitas</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6 border-2 border-green-200">
                <p className="text-center font-black text-green-700 mb-2">🎯 EXPERIMENTE SEM RISCO:</p>
                <p className="text-center text-green-600 font-semibold mb-2">
                  7 dias para reembolso, não pagará nada!
                </p>
                <p className="text-center text-sm text-gray-600">
                  Não gostou? Cancela e não paga nada
                </p>
              </div>
              
              <Link
                to="/login"
                onClick={handleTesteGratisClick}
                className="w-full py-4 px-6 rounded-xl font-black transition-all text-center block bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl hover:scale-105 text-lg mb-4"
              >
                COMEÇAR MEU TESTE GRÁTIS
              </Link>

              <div className="text-center text-sm text-gray-500 space-y-1">
                <p>✓ Cancele quando quiser</p>
                <p>✓ Dentro dos primeiros 7 dias totalmente grátis</p>
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
                🛡️ Garantia Total
              </h3>
              <p className="text-lg text-gray-700 mb-6">
               Garantia em até 7 dias. Se depois que começar a pagar não gostar, 
                devolvemos 100% do seu dinheiro nos primeiros 30 dias.
              </p>
              <p className="text-sm text-gray-600">
                Você não tem nada a perder
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
              Você Tem 2 Caminhos
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Qual você vai escolher?
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
                  Continuar Ganhando Pouco
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">❌ Vender barato e mal lucrar</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">❌ Trabalhar muito por pouco dinheiro</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">❌ Nunca conseguir uma renda extra boa</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">❌ Ficar sempre dependendo de outros</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700 font-bold">❌ Continuar na mesma situação</p>
                </div>
              </div>

              <div className="bg-red-100 border border-red-300 p-6 rounded-lg mt-6">
                <p className="text-red-800 font-black text-center">
                  💸 Resultado: Continuar sem dinheiro extra
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
                  Ganhar R$ 1.500-3.000/mês
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-bold">✅ Cobrar o preço certo e lucrar de verdade</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-bold">✅ Ter renda extra que ajuda nas contas</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-bold">✅ Fazer parte de comunidade com 4.200+ mulheres</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-bold">✅ Ter mais independência financeira</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-bold">✅ Conquistar seus objetivos</p>
                </div>
              </div>

              <div className="bg-green-100 border border-green-300 p-6 rounded-lg mt-6">
                <p className="text-green-800 font-black text-center mb-2">
                  💰 Resultado: Renda extra todo mês
                </p>
                <p className="text-green-700 text-center font-semibold">
                  Teste 7 dias grátis - Sem risco
                </p>
              </div>

              <Link
                to="/login"
                onClick={handleTesteGratisClick}
                className="w-full mt-6 py-4 px-6 rounded-xl font-black transition-all text-center block bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl hover:scale-105 text-lg"
              >
                ESCOLHER O CAMINHO CERTO
              </Link>
            </div>
          </div>

          <div className="text-center mt-12 max-w-3xl mx-auto">
            <div className="bg-yellow-100 border border-yellow-400 p-6 rounded-xl">
              <p className="text-yellow-800 font-black text-lg mb-2">
                ⏰ HORA DE DECIDIR
              </p>
              <p className="text-yellow-700">
                Cada dia que passa é uma oportunidade perdida de ganhar dinheiro. 
                Você pode continuar como está ou começar a ganhar renda extra hoje mesmo. 
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
              Você Merece Ganhar Mais
              <span className="block text-yellow-300">Fazendo o que Você Gosta</span>
            </h2>
            
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Pare de trabalhar de graça. Pare de vender barato. 
              <strong className="text-yellow-300">Comece a ganhar o que você merece</strong> fazendo 
              doces em casa.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 max-w-3xl mx-auto">
              <h3 className="text-2xl font-black mb-6">O que você ganha hoje:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Saber quanto cobrar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Receitas que vendem bem</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Comunidade de apoio</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Controle de lucro</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">Ajuda sempre que precisar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="font-semibold">4.200+ mulheres com você</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Link
                to="/login"
                onClick={handleTesteGratisClick}
                className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-6 rounded-xl text-2xl font-black hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                <Sparkles className="h-8 w-8" />
                <span>COMEÇAR AGORA GRÁTIS</span>
                <ArrowRight className="h-8 w-8" />
              </Link>
              
              <div className="text-lg opacity-90 space-y-2">
                <p>✓ 7 dias totalmente grátis</p>
                <p>✓ Cancele quando quiser</p>
                <p>✓ Junte-se a 1200+ de mulheres</p>
              </div>

              <div className="bg-yellow-400/20 rounded-xl p-6 mt-8 max-w-2xl mx-auto">
                <p className="text-yellow-200 font-black text-lg mb-2">
                  💡 Lembre-se:
                </p>
                <p className="text-white">
                  Cada dia que passa é uma chance de ganhar dinheiro extra. 
                  <strong className="text-yellow-300">Comece hoje</strong> e veja a diferença já na próxima venda.
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
              Respondemos as principais perguntas
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">

            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-blue-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                É difícil de usar?
              </h3>
              <p className="text-gray-700">
                Não! É fácil como usar WhatsApp. Qualquer pessoa consegue usar, 
                mesmo quem nunca usou app assim antes.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-purple-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Funciona mesmo para ganhar renda extra?
              </h3>
              <p className="text-gray-700">
                Sim! Mais de 4.200 mulheres já estão usando. A calculadora te ajuda a cobrar o preço certo, 
                e as receitas do marketplace são produtos que vendem bem e dão lucro.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-pink-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Posso cancelar quando quiser?
              </h3>
              <p className="text-gray-700">
                Sim! pode cancelar em até 7 dias e não paga nada.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-yellow-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Preciso ser profissional?
              </h3>
              <p className="text-gray-700">
                Não! O app é para qualquer pessoa que faz ou quer fazer doces para vender. 
                Iniciantes são muito bem-vindas!
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border-l-8 border-indigo-500">
              <h3 className="text-xl font-black text-gray-900 mb-4">
                Como funciona a comunidade?
              </h3>
              <p className="text-gray-700">
                É um espaço onde você pode conversar com outras mulheres que também vendem doces, 
                tirar dúvidas, compartilhar experiências e aprender juntas.
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
                <Heart className="h-5 w-5 text-red-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-3xl font-black">DoceCalc</span>
            </div>
            
            <p className="text-gray-300 text-lg mb-6 font-semibold">
              Ajudando 4.200+ mulheres a ganhar renda extra
            </p>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                © 2024 DoceCalc. Todos os direitos reservados. 
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Feito com carinho para mulheres que merecem ganhar mais.
              </p>
            </div>

            <div className="flex justify-center items-center space-x-6 mt-6">
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold">
                🔒 100% SEGURO
              </div>
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold">
                🛡️ 7 DIAS DE GARANTIA
              </div>
            </div>
          </div>
        </div>

        {/* Sticky CTA Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-500 to-green-600 p-4 z-50 shadow-2xl">
          <Link
            to="/login"
            onClick={handleTesteGratisClick}
            className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-black text-center block hover:bg-yellow-300 transition-all"
          >
            COMEÇAR GRÁTIS AGORA
          </Link>
        </div>
      </footer>
    </div>
  )
}