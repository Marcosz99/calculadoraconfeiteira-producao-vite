import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { processDocumentFiscal, DocumentFiscalData } from '../services/geminiService';

interface DocumentUploadProps {
  onDocumentProcessed: (document: DocumentFiscalData) => void;
  onClose: () => void;
  isOpen: boolean;
  title?: string;
  description?: string;
}

export default function DocumentUpload({ 
  onDocumentProcessed, 
  onClose, 
  isOpen, 
  title = "Upload de Documento Fiscal",
  description = "Faça upload de notas fiscais, extratos ou comprovantes para análise automática"
}: DocumentUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc).');
      return;
    }

    // Verificar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. O tamanho máximo é de 10MB.');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      setProcessingStep('Analisando documento...');
      
      // Process the document with OCR
      const documentData = await processDocumentFiscal(file);
      
      setProcessingStep('Documento processado com sucesso!');
      
      // Wait a moment to show success message
      setTimeout(() => {
        onDocumentProcessed(documentData);
        handleClose();
      }, 1000);
      
    } catch (err) {
      console.error('Erro ao processar documento:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar o documento');
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
      setDragActive(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {!isProcessing && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>

          <p className="text-gray-600 mb-6 text-sm">
            {description}
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {isProcessing ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600 mb-2">{processingStep}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full w-2/3 animate-pulse"></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Processando com inteligência artificial...
              </p>
            </div>
          ) : (
            <div>
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Arraste um documento aqui ou clique para selecionar
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Formatos aceitos: JPG, PNG, GIF, WEBP (máx. 10MB)
                </p>
              </div>

              {/* Upload Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span>Selecionar do Computador</span>
                </button>

                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <span>Tirar Foto</span>
                </button>
              </div>

              {/* Hidden File Inputs */}
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

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 text-sm">💡 Dicas para melhor resultado:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Certifique-se de que o documento está bem iluminado</li>
                  <li>• Evite sombras e reflexos</li>
                  <li>• Mantenha o documento reto e completo na foto</li>
                  <li>• Use uma resolução alta para textos pequenos</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}