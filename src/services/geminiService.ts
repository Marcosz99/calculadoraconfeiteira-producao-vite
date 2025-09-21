import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with runtime check
const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Chave da API Gemini não configurada. Verifique as configurações.');
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export interface RecipeData {
  nome: string;
  ingredientes: Array<{
    nome: string;
    quantidade: number | null;
    unidade: string;
  }>;
  modo_preparo: string[];
  tempo_estimado: number | null;
  rendimento: string | null;
}

// Extract text from image using Gemini Vision
export async function extractTextFromImage(imageFile: File): Promise<string> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Convert file to base64
    const base64Data = await fileToBase64(imageFile);
    
    const prompt = `
    Analise esta imagem de receita manuscrita ou impressa e extraia TODO o texto legível.
    Mantenha a estrutura original e não interprete ainda - apenas extraia o texto como está.
    Se houver partes ilegíveis, indique com [ILEGÍVEL].
    `;
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: imageFile.type,
      },
    };
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    
    return response.text() || '';
  } catch (error) {
    console.error('Erro ao extrair texto da imagem:', error);
    throw new Error('Erro ao processar a imagem. Tente novamente.');
  }
}

// Structure recipe data from extracted text using Gemini
export async function structureRecipeFromText(extractedText: string): Promise<RecipeData> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
    Você é especialista em organizar receitas de confeitaria brasileira.
    Analise este texto extraído de uma receita e estruture em formato JSON.
    
    Texto da receita:
    ${extractedText}
    
    Retorne JSON exatamente neste formato:
    {
      "nome": "nome da receita (string)",
      "ingredientes": [
        {
          "nome": "nome do ingrediente (string)",
          "quantidade": número ou null se não especificado,
          "unidade": "unidade de medida (string: g, ml, xícara, colher, unidade, etc)"
        }
      ],
      "modo_preparo": ["passo 1", "passo 2", "passo 3"],
      "tempo_estimado": minutos estimados (number) ou null,
      "rendimento": "descrição do rendimento (string)" ou null
    }
    
    REGRAS IMPORTANTES para preservar nomes dos ingredientes:
    - SEMPRE preserve o nome EXATO do ingrediente como escrito na receita original
    - Se algo não estiver claro, coloque null para números ou string vazia para texto
    - Para unidades, padronize: g, ml, xícara, colher de sopa, colher de chá, unidade, pitada, etc
    - Para quantidades, converta frações: 1/2 = 0.5, 1/4 = 0.25, etc
    - Modo de preparo deve ser lista de passos numerados
    - Se não conseguir identificar o nome, use "Receita Digitalizada"
    - CRUCIAL: Mantenha nomes de ingredientes como estão escritos (ex: "leite condensado", "açúcar cristal", "farinha de trigo")
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    
    try {
      // Clean JSON text by removing code fences and extra text
      const cleanJsonText = cleanJSONResponse(jsonText);
      const structured = JSON.parse(cleanJsonText) as RecipeData;
      
      // Validate structure
      if (!structured || typeof structured.nome !== 'string') {
        throw new Error('Estrutura inválida');
      }
      
      return {
        nome: structured.nome || 'Receita Digitalizada',
        ingredientes: Array.isArray(structured.ingredientes) ? structured.ingredientes : [],
        modo_preparo: Array.isArray(structured.modo_preparo) ? structured.modo_preparo : [extractedText],
        tempo_estimado: structured.tempo_estimado || null,
        rendimento: structured.rendimento || null
      };
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      // Retorna estrutura básica se o parse falhar
      return {
        nome: 'Receita Digitalizada',
        ingredientes: [],
        modo_preparo: [extractedText],
        tempo_estimado: null,
        rendimento: null
      };
    }
    
  } catch (error) {
    console.error('Erro ao estruturar receita:', error);
    throw new Error('Erro ao processar a receita. Tente novamente.');
  }
}

// Complete OCR process: extract + structure + validate ingredients
export async function processRecipeImage(imageFile: File): Promise<RecipeData> {
  try {
    // Step 1: Extract text from image
    const extractedText = await extractTextFromImage(imageFile);
    
    if (!extractedText.trim()) {
      throw new Error('Não foi possível extrair texto da imagem. Certifique-se de que a imagem contém texto legível.');
    }
    
    // Step 2: Structure the recipe data
    const structuredData = await structureRecipeFromText(extractedText);
    
    // Step 3: Validate and improve ingredient mapping while preserving original names
    if (structuredData.ingredientes && structuredData.ingredientes.length > 0) {
      try {
        const validatedIngredients = await validateIngredients(structuredData.ingredientes);
        structuredData.ingredientes = validatedIngredients;
      } catch (validationError) {
        console.warn('Erro na validação de ingredientes, usando dados originais:', validationError);
        // Continue with original ingredients if validation fails
      }
    }
    
    return structuredData;
  } catch (error) {
    console.error('Erro no processamento completo:', error);
    throw error;
  }
}

// Helper function to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/jpeg;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper function to clean JSON response from AI models
function cleanJSONResponse(text: string): string {
  // Remove markdown code fences if present
  let cleaned = text.trim();
  
  // Remove ```json at start and ``` at end
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '');
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  
  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace <= lastBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return cleaned.trim();
}

// Validate and improve ingredient matching
export async function validateIngredients(ingredientes: RecipeData['ingredientes']): Promise<RecipeData['ingredientes']> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
    Você é especialista em ingredientes de confeitaria brasileira.
    Analise esta lista de ingredientes e corrija nomes/unidades se necessário.
    
    Ingredientes: ${JSON.stringify(ingredientes)}
    
    Corrija:
    - Nomes de ingredientes (ex: "acucar" -> "Açúcar Cristal")
    - Unidades padronizadas (ex: "gr" -> "g", "cc" -> "ml")
    - Quantidades em formato decimal quando necessário
    
    Retorne JSON no mesmo formato da entrada, apenas com correções.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    
    try {
      return JSON.parse(jsonText) as RecipeData['ingredientes'];
    } catch {
      // Se falhar, retorna a lista original
      return ingredientes;
    }
  } catch (error) {
    console.error('Erro ao validar ingredientes:', error);
    return ingredientes;
  }
}