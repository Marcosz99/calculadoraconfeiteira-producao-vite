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
    const tipo = formData.get('tipo') as string

    if (!imageFile || !tipo) {
      throw new Error('Arquivo de imagem e tipo são obrigatórios')
    }

    console.log('📄 Processando documento financeiro:', imageFile.name, 'Tipo:', tipo)

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)))

    // Configurar prompt especializado
    const prompt = `Você é um especialista em análise de documentos fiscais brasileiros para confeitarias.

Analise esta imagem de comprovante, nota fiscal ou documento financeiro e extraia TODOS os dados relevantes:

IDENTIFIQUE:
- Valor total da transação (número principal)
- Data da transação (formato DD/MM/AAAA ou DD/MM/AA)
- Nome da empresa/estabelecimento
- Tipo de documento (nota fiscal, comprovante PIX, cartão, etc)
- Método de pagamento (PIX, cartão, dinheiro, etc)
- Descrição dos itens ou serviços
- Observações importantes

CATEGORIZE automaticamente baseado no contexto:
- Se for RECEITA: "Vendas Bolos", "Vendas Docinhos", "Vendas Tortas", "Encomendas", etc
- Se for DESPESA: "Ingredientes", "Embalagens", "Equipamentos", "Marketing", "Contas", etc

Retorne JSON exatamente neste formato:
{
  "valor_total": número decimal (ex: 125.50),
  "data": "YYYY-MM-DD",
  "empresa_emitente": "nome da empresa",
  "categoria": "categoria apropriada",
  "descricao": "descrição detalhada do que foi comprado/vendido",
  "metodo_pagamento": "pix" | "cartao_credito" | "cartao_debito" | "dinheiro" | "outros",
  "tipo_documento": "nota_fiscal" | "comprovante" | "extrato" | "outro",
  "observacoes": "informações extras importantes" ou null
}

REGRAS IMPORTANTES:
- Sempre retorne números decimais para valores (ex: 45.80, não "45,80")
- Para datas, converta sempre para formato YYYY-MM-DD
- Se não conseguir identificar um campo, use null
- Para valores, procure o valor TOTAL da transação, não valores parciais
- Seja preciso na categorização baseada no tipo de negócio (confeitaria)

Tipo de transação solicitado: ${tipo === 'receita' ? 'RECEITA (venda)' : 'DESPESA (compra/gasto)'}`

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
          maxOutputTokens: 1024,
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
      throw new Error('Não foi possível extrair dados estruturados do documento')
    }

    const jsonString = aiResponse.substring(jsonStart, jsonEnd + 1)
    const extractedData = JSON.parse(jsonString)

    console.log('📊 Dados extraídos:', extractedData)

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
        valor_total: 0,
        data: new Date().toISOString().split('T')[0],
        empresa_emitente: 'Não foi possível extrair',
        categoria: 'Outros',
        descricao: 'Erro no processamento do documento',
        metodo_pagamento: 'outros',
        tipo_documento: 'outro',
        observacoes: 'Documento não pôde ser processado automaticamente'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})