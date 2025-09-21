import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { RecipeData } from '../services/geminiService';

interface RecipeOCRProps {
  onRecipeExtracted: (recipe: RecipeData) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function RecipeOCR({ onRecipeExtracted, onClose, isOpen }: RecipeOCRProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      setProcessingStep('Extraindo texto da imagem...');
      
      console.log('🔍 Processando receita com IA...', file.name)
      
      // Preparar FormData para envio do arquivo
      const formData = new FormData()
      formData.append('imageFile', file)

      // Chamar API do Gemini via Supabase Edge Function
      const response = await fetch(`https://dbwbxzbtydeauczfleqx.supabase.co/functions/v1/process-recipe-ocr`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Erro HTTP:', errorText)
        throw new Error('Erro ao processar a receita')
      }

      const data = await response.json()

      if (data.error) {
        console.error('❌ Erro na API:', data.error)
        throw new Error('Erro ao processar a receita')
      }

      console.log('✅ Receita extraída:', data)

      const recipeData: RecipeData = {
        nome: data.nome || 'Receita Digitalizada',
        ingredientes: data.ingredientes || [],
        modo_preparo: data.modo_preparo || [],
        tempo_estimado: data.tempo_preparo_minutos || null,
        rendimento: data.rendimento || null
      }
      
      setProcessingStep('Receita digitalizada com sucesso!');
      
      // Wait a moment to show success message
      setTimeout(() => {
        onRecipeExtracted(recipeData);
        handleClose();
      }, 1000);
      
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar a imagem');
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setError('');
      setProcessingStep('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Digitalizar Receita
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Tire uma foto ou faça upload da sua receita
              </p>
            </div>
            {!isProcessing && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Content */}
          {isProcessing ? (
            <div className="text-center py-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Processando receita...
                  </p>
                  <p className="text-sm text-gray-600">
                    {processingStep}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="text-gray-400">
                    <Camera className="h-12 w-12 mx-auto" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Adicione sua receita
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Arraste uma imagem ou clique para selecionar
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-sm font-medium">Câmera</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-sm font-medium">Arquivo</span>
                </button>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Dicas para melhor resultado:
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Use boa iluminação</li>
                  <li>• Mantenha a receita plana</li>
                  <li>• Evite sombras sobre o texto</li>
                  <li>• Certifique-se de que o texto está legível</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </div>
  );
}