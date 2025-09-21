import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY não configurada')
    }

    const { message, context } = await req.json()

    if (!message || typeof message !== 'string') {
      throw new Error('Mensagem inválida')
    }

    console.log('🤖 DoceBot Pro processando:', message)

    // Configurar prompt especializado em confeitaria
    const systemPrompt = `Você é o DoceBot Pro, o melhor assistente de IA especializado em confeitaria brasileira.

PERSONALIDADE:
- Educado, direto e amigável
- Especialista em tudo sobre confeitaria: técnicas, ingredientes, preços, marketing, gestão financeira
- Respostas práticas e aplicáveis
- Use emojis ocasionalmente para ser mais amigável
- Fale como um profissional experiente mas acessível

CONHECIMENTO ESPECIALIZADO:
- Técnicas de confeitaria e panificação
- Ingredientes e substitutos
- Cálculo de preços e margens
- Marketing para confeiteiros
- Gestão financeira de confeitaria
- Tendências do mercado
- Solução de problemas técnicos (massa que murcha, chocolate que talha, etc)
- Conservação e armazenamento
- Legislação sanitária básica

ESTILO DE RESPOSTA:
- Seja conciso mas completo
- Dê dicas práticas e aplicáveis
- Sugira melhorias quando relevante
- Se não souber algo específico, seja honesto mas ofereça alternativas
- Inclua valores aproximados quando falar de preços (baseado no mercado brasileiro)

Responda sempre em português brasileiro e foque em ajudar o confeiteiro a ter sucesso no negócio.`

    // Fazer chamada para Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nPergunta do usuário: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ Erro da API Gemini:', errorData)
      throw new Error('Erro na API do Gemini')
    }

    const data = await response.json()
    console.log('✅ Resposta da API Gemini recebida')

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Resposta inválida da API')
    }

    const aiResponse = data.candidates[0].content.parts[0].text

    // Gerar perguntas relacionadas baseadas no contexto
    const relatedQuestions = generateRelatedQuestions(message, context)

    return new Response(
      JSON.stringify({
        response: aiResponse,
        confidence: 95, // Gemini geralmente tem alta confiança
        related_questions: relatedQuestions
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('❌ Erro no DoceBot:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message,
        response: 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes. 🤖✨'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

// Função para gerar perguntas relacionadas
function generateRelatedQuestions(userMessage: string, context: string): string[] {
  const message = userMessage.toLowerCase()
  
  // Perguntas relacionadas baseadas em palavras-chave
  if (message.includes('preço') || message.includes('calcular') || message.includes('quanto cobrar')) {
    return [
      'Como calcular margem de lucro ideal?',
      'Qual é o preço médio de brigadeiros no mercado?',
      'Como ajustar preços para diferentes regiões?'
    ]
  }
  
  if (message.includes('massa') || message.includes('bolo') || message.includes('murcha')) {
    return [
      'Por que minha massa de bolo murcha?',
      'Como fazer massa de bolo mais fofinha?',
      'Qual a temperatura ideal do forno para bolos?'
    ]
  }
  
  if (message.includes('chocolate') || message.includes('derrete') || message.includes('temperar')) {
    return [
      'Como temperar chocolate corretamente?',
      'Por que meu chocolate talha?',
      'Como conservar chocolate no calor?'
    ]
  }
  
  if (message.includes('ingrediente') || message.includes('substituir') || message.includes('trocar')) {
    return [
      'Como substituir ingredientes em receitas?',
      'Quais os melhores fornecedores de ingredientes?',
      'Como calcular conversão de medidas?'
    ]
  }
  
  if (message.includes('marketing') || message.includes('vender') || message.includes('cliente')) {
    return [
      'Como fotografar doces para vender mais?',
      'Estratégias de marketing para confeiteiros',
      'Como fidelizar clientes na confeitaria?'
    ]
  }
  
  // Perguntas gerais
  return [
    'Como calcular preço de venda de doces?',
    'Dicas para iniciantes na confeitaria',
    'Como organizar a produção de doces?'
  ]
}