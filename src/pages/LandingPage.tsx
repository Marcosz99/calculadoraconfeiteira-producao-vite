import React, { useState, useEffect, useRef } from 'react'
import { ArrowRight, CheckCircle, Clock, Gift, Shield, X, Zap } from 'lucide-react'

export default function LowTicketLandingPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 14, seconds: 47 })
  const [pageViews] = useState(1600)
  const [showExitPopup, setShowExitPopup] = useState(false)
  const [testimonialsVisible, setTestimonialsVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  
  const CHECKOUT_URL = "https://www.ggcheckout.com/checkout/v2/wrM72UGZAlqMlrhoPWbK?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}"

  // Timer countdown - Otimizado para evitar re-renders
  useEffect(() => {
    let animationFrameId: number
    let lastTime = Date.now()
    
    const updateTimer = () => {
      const currentTime = Date.now()
      if (currentTime - lastTime >= 1000) {
        lastTime = currentTime
        setTimeLeft(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 }
          } else if (prev.minutes > 0) {
            return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 }
          } else if (prev.hours > 0) {
            return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
          }
          return prev
        })
      }
      animationFrameId = requestAnimationFrame(updateTimer)
    }
    
    animationFrameId = requestAnimationFrame(updateTimer)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  // Exit intent
  useEffect(() => {
    let hasShown = false
    const handleMouseLeave = (e: MouseEvent) => {
      if (!hasShown && e.clientY <= 0) {
        setShowExitPopup(true)
        hasShown = true
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  // Lazy load vídeo de depoimentos
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTestimonialsVisible(true)
        }
      },
      { rootMargin: '200px' }
    )
    
    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  const handleCTAClick = () => {
    window.location.href = CHECKOUT_URL
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Barra de Urgência Fixa */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-orange-600 py-3 px-4 z-50 shadow-2xl">
        <div className="container mx-auto flex justify-center items-center space-x-4 text-sm sm:text-base font-black">
          <Clock className="h-5 w-5 animate-pulse" />
          <span>OFERTA EXPIRA EM:</span>
          <div className="flex space-x-2">
            <div className="bg-black px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</div>
            <span>:</span>
            <div className="bg-black px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <span>:</span>
            <div className="bg-black px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</div>
          </div>
        </div>
      </div>

      {/* Hero com VSL */}
      <section className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-5xl">
          
          {/* Headline Apelona */}
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight">
              <span className="text-yellow-400">DESCUBRA AS 50 RECEITAS</span>
              <br />
              <span className="text-red-500">DE BOLO DE POTE</span>
              <br />
              <span className="text-white">Que Estão Fazendo Donas de Casa</span>
              <br />
              <span className="text-green-400">FATURAREM ATÉ R$ 3.000/MÊS</span>
            </h1>
            
            <div className="inline-block bg-yellow-400 text-black px-6 py-2 rounded text-lg font-black animate-pulse mb-4">
              ⚡ MAIS DE {pageViews.toLocaleString('pt-BR')} PESSOAS JÁ VISITARAM ESTA PÁGINA
            </div>
          </div>

          {/* VSL - Tamanho GIGANTE */}
          <div className="mb-6 -mx-4 sm:mx-0">
            <div className="relative bg-gray-900 sm:rounded-lg shadow-2xl overflow-hidden border-4 border-red-500 aspect-video sm:aspect-video" style={{ aspectRatio: '16/12' }}>
              <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover sm:object-contain"
                controls
                playsInline
                preload="none"
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%23111' width='16' height='9'/%3E%3C/svg%3E"
              >
                <source src="https://dbwbxzbtydeauczfleqx.supabase.co/storage/v1/object/public/landingpage/Mini%20VSL%20Frankstein.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* CTA Principal GIGANTE */}
          <div className="text-center mb-6">
            <button
              onClick={handleCTAClick}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-6 rounded-lg text-2xl sm:text-3xl font-black hover:scale-105 transition-transform duration-200 shadow-2xl"
            >
              🔥 SIM! QUERO AS 50 RECEITAS AGORA
            </button>
            
            <div className="mt-4 text-xl font-bold">
              <span className="text-red-500 line-through">R$ 97</span>
              <span className="text-yellow-400 text-4xl mx-3">R$ 29</span>
              <span className="text-gray-400">hoje</span>
            </div>
            
            <p className="mt-2 text-green-400 font-bold">
              ✅ PAGOU, RECEBEU NA HORA! Acesso em 2 minutos no seu email
            </p>
          </div>
        </div>
      </section>

      {/* O Que Você Recebe - DESTAQUE NOS BÔNUS */}
      <section className="py-12 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-8">
            <span className="text-yellow-400">VEJA TUDO</span> O QUE VOCÊ VAI RECEBER <span className="text-red-500">HOJE:</span>
          </h2>

          <div className="bg-gray-800 rounded-xl p-6 sm:p-8 border-4 border-yellow-400 mb-6">
            <div className="space-y-4">
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-black text-yellow-400">50 RECEITAS COMPLETAS DE BOLO DE POTE</h3>
                  <p className="text-gray-300">Do clássico ao gourmet. Passo a passo com fotos, ingredientes, custos e preços sugeridos</p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <p className="text-red-500 font-black text-xl mb-4">🎁 BÔNUS EXCLUSIVOS (Valor R$ 197):</p>
              </div>

              <div className="flex items-start space-x-3 bg-yellow-400/10 p-3 rounded">
                <Gift className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-black text-yellow-400">BÔNUS #1: Guia de fornecedores</h4>
                  <p className="text-sm text-gray-300">Descubra onde pegar e leve seu negócio a outro nivel com fornecedores</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-yellow-400/10 p-3 rounded">
                <Gift className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-black text-yellow-400">BÔNUS #2: Tabela de Compra de Ingredientes</h4>
                  <p className="text-sm text-gray-300">Saiba exatamente o que comprar para 10, 20 ou 50 potes</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-yellow-400/10 p-3 rounded">
                <Gift className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-black text-yellow-400">BÔNUS #3: Guia de Validade e Conservação</h4>
                  <p className="text-sm text-gray-300">Quanto tempo cada bolo dura + como armazenar e transportar</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-yellow-400/10 p-3 rounded">
                <Gift className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-black text-yellow-400">BÔNUS #4: Acesso à Comunidade Exclusiva</h4>
                  <p className="text-sm text-gray-300">Troque dicas, tire dúvidas e veja o sucesso das outras</p>
                </div>
              </div>

            </div>

            <div className="mt-6 bg-green-600 rounded-lg p-4 text-center">
              <p className="font-black text-2xl">VALOR TOTAL: R$ 294</p>
              <p className="text-3xl font-black mt-2">HOJE POR APENAS: R$ 29</p>
              <p className="text-sm mt-2">Isso é menos de R$ 0,60 por receita!</p>
            </div>
          </div>

          {/* CTA Repetido */}
          <button
            onClick={handleCTAClick}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-6 rounded-lg text-2xl font-black hover:scale-105 transition-transform duration-200 shadow-2xl mb-4"
          >
            QUERO ACESSO IMEDIATO POR R$ 29
          </button>

          <p className="text-center text-green-400 font-bold">
            ✅ Pagamento seguro | ✅ Acesso instantâneo | ✅ Garantia de 7 dias
          </p>
        </div>
      </section>

      {/* Depoimentos em Vídeo */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-8">
            <span className="text-yellow-400">VEJA QUEM JÁ ESTÁ</span>
            <br />
            <span className="text-red-500">FATURANDO COM BOLO DE POTE</span>
          </h2>

          <div ref={testimonialsRef} className="bg-black rounded-lg overflow-hidden border-4 border-yellow-400 mb-6">
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              {testimonialsVisible ? (
                <video
                  className="absolute top-0 left-0 w-full h-full"
                  controls
                  playsInline
                  preload="none"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%23000' width='16' height='9'/%3E%3C/svg%3E"
                >
                  <source src="https://dbwbxzbtydeauczfleqx.supabase.co/storage/v1/object/public/landingpage/Depoimentos%20Plus.mp4" type="video/mp4" />
                </video>
              ) : (
                <div className="absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center">
                  <div className="text-gray-500">Carregando...</div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCTAClick}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-6 rounded-lg text-2xl font-black hover:scale-105 transition-transform duration-200 shadow-2xl"
          >
            🔥 EU TAMBÉM QUERO FATURAR!
          </button>
        </div>
      </section>

      {/* Garantia */}
      <section className="py-12 px-4 bg-black">
        <div className="container mx-auto max-w-3xl text-center">
          <Shield className="h-20 w-20 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">
            <span className="text-green-400">GARANTIA INCONDICIONAL</span>
            <br />
            DE 7 DIAS
          </h2>
          <p className="text-xl mb-6">
            Teste as receitas por 7 dias. Se não gostar, <span className="text-yellow-400 font-black">devolvemos 100% do seu dinheiro</span>. Sem perguntas, sem enrolação.
          </p>
          <p className="text-gray-400">
            O risco é todo nosso. Você só tem a ganhar.
          </p>
        </div>
      </section>

      {/* FAQ Mínimo */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-black text-center mb-8 text-yellow-400">
            PERGUNTAS FREQUENTES
          </h2>

          <div className="space-y-4">
            <details className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
              <summary className="font-black text-lg cursor-pointer">
                Como vou receber as receitas?
              </summary>
              <p className="mt-3 text-gray-300">
                Você recebe TUDO por email em até 2 minutos após a compra. É só clicar no link e começar!
              </p>
            </details>

            <details className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
              <summary className="font-black text-lg cursor-pointer">
                Nunca fiz bolo de pote. Vou conseguir?
              </summary>
              <p className="mt-3 text-gray-300">
                SIM! As receitas são passo a passo para iniciantes. Se você consegue fazer um bolo comum, consegue fazer bolo de pote.
              </p>
            </details>

            <details className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
              <summary className="font-black text-lg cursor-pointer">
                Realmente vou conseguir vender?
              </summary>
              <p className="mt-3 text-gray-300">
                Bolo de pote vende SOZINHO pela foto. E você recebe os bônus ensinando exatamente como divulgar e vender.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final Desesperado */}
      <section className="py-16 px-4 bg-gradient-to-b from-red-900 to-black">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            <span className="text-yellow-400">ÚLTIMA CHANCE!</span>
            <br />
            <span className="text-white">Não Deixe Essa Oportunidade Passar</span>
          </h2>

          <p className="text-2xl mb-8">
            Enquanto você lê isso, <span className="text-yellow-400 font-black">centenas de mulheres</span> já estão fazendo e vendendo.
          </p>

          <div className="bg-black/50 rounded-xl p-8 mb-8 border-4 border-yellow-400">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-4xl font-black text-yellow-400">50</div>
                <div className="text-sm">Receitas</div>
              </div>
              <div>
                <div className="text-4xl font-black text-green-400">R$ 29</div>
                <div className="text-sm">Hoje</div>
              </div>
              <div>
                <div className="text-4xl font-black text-red-400">7</div>
                <div className="text-sm">Dias Garantia</div>
              </div>
            </div>

            <button
              onClick={handleCTAClick}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-8 rounded-lg text-3xl font-black hover:scale-105 transition-transform duration-200 shadow-2xl"
            >
              GARANTIR MINHA VAGA AGORA!
            </button>

            <p className="mt-4 text-green-400 font-bold text-lg">
              🔒 Pagamento 100% Seguro | ⚡ Acesso Instantâneo
            </p>
          </div>

          <p className="text-gray-400 italic">
            "O melhor momento para começar foi ontem. O segundo melhor é AGORA."
          </p>
        </div>
      </section>

      {/* Footer Mínimo */}
      <footer className="bg-black py-8 px-4 border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 DoceCalc - Todos os direitos reservados</p>
          <p className="mt-2">Este produto não garante resultados. Os ganhos dependem do seu esforço.</p>
        </div>
      </footer>

      {/* Exit Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-red-600 to-black rounded-xl p-8 max-w-md relative border-4 border-yellow-400">
            <button
              onClick={() => setShowExitPopup(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h3 className="text-3xl font-black text-yellow-400 mb-4 text-center">
              ESPERA!
            </h3>
            <p className="text-xl text-white mb-6 text-center">
              Não saia sem garantir suas <span className="text-yellow-400 font-black">50 receitas por R$ 29!</span>
            </p>
            <p className="text-center mb-6">
              Essa oferta pode não estar disponível quando você voltar.
            </p>
            <button
              onClick={handleCTAClick}
              className="w-full bg-yellow-400 text-black px-8 py-4 rounded-lg text-xl font-black hover:scale-105 transition-transform"
            >
              GARANTIR AGORA!
            </button>
          </div>
        </div>
      )}

      {/* Botão Flutuante Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 p-3 z-40 shadow-2xl">
        <button
          onClick={handleCTAClick}
          className="w-full bg-black text-yellow-400 py-4 rounded-lg font-black text-lg border-2 border-yellow-400"
        >
          QUERO POR R$ 29 AGORA!
        </button>
      </div>
    </div>
  )
}