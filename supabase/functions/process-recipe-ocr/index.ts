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

    const formData = await req.formData()
    const imageFile = formData.get('imageFile') as File

    if (!imageFile) {
      throw new Error('Arquivo de imagem é obrigatório')
    }

    console.log('📝 Processando receita OCR:', imageFile.name)

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)))

    // Configurar prompt especializado para receitas
    const prompt = `Você é um especialista em receitas de confeitaria brasileira.

Analise esta imagem de receita (manuscrita ou impressa) e extraia TODOS os dados estruturados:

EXTRAIA:
- Nome da receita
- Lista completa de ingredientes com quantidades e unidades
- Modo de preparo passo a passo
- Tempo de preparo estimado
- Rendimento da receita
- Observações importantes

ESTRUTURE o resultado como JSON exato:
{
  "nome": "nome da receita",
  "ingredientes": [
    {
      "nome": "nome exato do ingrediente",
      "quantidade": número ou null se não especificado,
      "unidade": "g" | "ml" | "xícara" | "colher de sopa" | "colher de chá" | "unidade" | "pitada" | etc
    }
  ],
  "modo_preparo": [
    "Passo 1 detalhado",
    "Passo 2 detalhado",
    "etc..."
  ],
  "tempo_preparo_minutos": número ou null,
  "rendimento": "descrição do rendimento" ou null,
  "observacoes": "dicas importantes ou observações" ou null
}

REGRAS CRÍTICAS:
- PRESERVE os nomes EXATOS dos ingredientes como escritos
- Converta frações para decimais: 1/2 = 0.5, 1/4 = 0.25, etc
- Padronize unidades: gr→g, cc→ml, c.sopa→colher de sopa, etc
- Se algo estiver ilegível, coloque null para números ou "ILEGÍVEL" para texto
- Modo de preparo deve ser lista ordenada de passos claros
- Para quantidades use NÚMEROS decimais, não strings

Foque na PRECISÃO e COMPLETUDE das informações extraídas.`

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
                text: prompt
              },
              {
                inline_data: {
                  mime_type: imageFile.type,
                  data: base64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1, // Baixa temperatura para maior precisão
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
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

    let aiResponse = data.candidates[0].content.parts[0].text

    // Limpar resposta e extrair JSON
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    // Encontrar o JSON na resposta
    const jsonStart = aiResponse.indexOf('{')
    const jsonEnd = aiResponse.lastIndexOf('}')
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('Não foi possível extrair dados estruturados da receita')
    }

    const jsonString = aiResponse.substring(jsonStart, jsonEnd + 1)
    const extractedData = JSON.parse(jsonString)

    // Validar estrutura básica
    if (!extractedData.nome) {
      extractedData.nome = 'Receita Digitalizada'
    }
    if (!Array.isArray(extractedData.ingredientes)) {
      extractedData.ingredientes = []
    }
    if (!Array.isArray(extractedData.modo_preparo)) {
      extractedData.modo_preparo = ['Modo de preparo não identificado']
    }

    console.log('📋 Receita extraída:', extractedData.nome)

    return new Response(
      JSON.stringify(extractedData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('❌ Erro no processamento:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message,
        nome: 'Erro no Processamento',
        ingredientes: [],
        modo_preparo: ['Não foi possível extrair o modo de preparo'],
        tempo_preparo_minutos: null,
        rendimento: null,
        observacoes: 'Erro no processamento automático da receita'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})