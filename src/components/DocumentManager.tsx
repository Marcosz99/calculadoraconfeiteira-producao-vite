import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, FileText, Calendar, DollarSign, Building } from 'lucide-react';
import { DocumentFiscalData } from '../services/geminiService';
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';
import DocumentUpload from './DocumentUpload';

export interface StoredDocument extends DocumentFiscalData {
  id: string;
  usuario_id: string;
  data_upload: string;
}

interface DocumentManagerProps {
  userId: string;
  onDocumentsChange?: (documents: StoredDocument[]) => void;
}

export default function DocumentManager({ userId, onDocumentsChange }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [editingDocument, setEditingDocument] = useState<StoredDocument | null>(null);

  useEffect(() => {
    const savedDocuments = getFromLocalStorage<StoredDocument[]>(LOCAL_STORAGE_KEYS.DOCUMENTOS_FISCAIS, []);
    const userDocuments = savedDocuments.filter(doc => doc.usuario_id === userId);
    setDocuments(userDocuments);
    onDocumentsChange?.(userDocuments);
  }, [userId, onDocumentsChange]);

  const handleDocumentProcessed = (documentData: DocumentFiscalData) => {
    const newDocument: StoredDocument = {
      ...documentData,
      id: Date.now().toString(),
      usuario_id: userId,
      data_upload: new Date().toISOString()
    };

    const allDocuments = getFromLocalStorage<StoredDocument[]>(LOCAL_STORAGE_KEYS.DOCUMENTOS_FISCAIS, []);
    const updatedDocuments = [...allDocuments, newDocument];
    
    setToLocalStorage(LOCAL_STORAGE_KEYS.DOCUMENTOS_FISCAIS, updatedDocuments);
    
    const userDocuments = updatedDocuments.filter(doc => doc.usuario_id === userId);
    setDocuments(userDocuments);
    onDocumentsChange?.(userDocuments);
    
    setShowUpload(false);
  };

  const handleDeleteDocument = (documentId: string) => {
    const allDocuments = getFromLocalStorage<StoredDocument[]>(LOCAL_STORAGE_KEYS.DOCUMENTOS_FISCAIS, []);
    const updatedDocuments = allDocuments.filter(doc => doc.id !== documentId);
    
    setToLocalStorage(LOCAL_STORAGE_KEYS.DOCUMENTOS_FISCAIS, updatedDocuments);
    
    const userDocuments = updatedDocuments.filter(doc => doc.usuario_id === userId);
    setDocuments(userDocuments);
    onDocumentsChange?.(userDocuments);
  };

  const handleEditDocument = (document: StoredDocument) => {
    setEditingDocument(document);
  };

  const handleSaveEdit = (editedDocument: StoredDocument) => {
    const allDocuments = getFromLocalStorage<StoredDocument[]>(LOCAL_STORAGE_KEYS.DOCUMENTOS_FISCAIS, []);
    const updatedDocuments = allDocuments.map(doc => 
      doc.id === editedDocument.id ? editedDocument : doc
    );
    
    setToLocalStorage(LOCAL_STORAGE_KEYS.DOCUMENTOS_FISCAIS, updatedDocuments);
    
    const userDocuments = updatedDocuments.filter(doc => doc.usuario_id === userId);
    setDocuments(userDocuments);
    onDocumentsChange?.(userDocuments);
    
    setEditingDocument(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTipoLabel = (tipo: string) => {
    const labels = {
      nota_fiscal: 'Nota Fiscal',
      extrato: 'Extrato Bancário',
      comprovante: 'Comprovante',
      outro: 'Outro'
    };
    return labels[tipo as keyof typeof labels] || 'Documento';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Documentos Fiscais
        </h3>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Documento</span>
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Nenhum documento fiscal cadastrado
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Adicionar Primeiro Documento
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <div key={document.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      document.tipo === 'nota_fiscal' ? 'bg-blue-100 text-blue-800' :
                      document.tipo === 'extrato' ? 'bg-green-100 text-green-800' :
                      document.tipo === 'comprovante' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getTipoLabel(document.tipo)}
                    </span>
                    {document.numero_documento && (
                      <span className="text-sm text-gray-600">
                        #{document.numero_documento}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-green-600">
                        {formatCurrency(document.valor_total)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(document.data)}
                      </span>
                    </div>

                    {document.empresa_emitente && (
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 truncate">
                          {document.empresa_emitente}
                        </span>
                      </div>
                    )}
                  </div>

                  {document.itens && document.itens.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {document.itens.length} {document.itens.length === 1 ? 'item' : 'itens'} registrados
                    </div>
                  )}

                  {document.observacoes && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {document.observacoes}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEditDocument(document)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(document.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUpload
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onDocumentProcessed={handleDocumentProcessed}
      />

      {/* Edit Modal */}
      {editingDocument && (
        <EditDocumentModal
          document={editingDocument}
          onSave={handleSaveEdit}
          onClose={() => setEditingDocument(null)}
        />
      )}
    </div>
  );
}

interface EditDocumentModalProps {
  document: StoredDocument;
  onSave: (document: StoredDocument) => void;
  onClose: () => void;
}

function EditDocumentModal({ document, onSave, onClose }: EditDocumentModalProps) {
  const [formData, setFormData] = useState({
    valor_total: document.valor_total,
    data: document.data,
    empresa_emitente: document.empresa_emitente || '',
    numero_documento: document.numero_documento || '',
    observacoes: document.observacoes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...document,
      ...formData,
      empresa_emitente: formData.empresa_emitente || undefined,
      numero_documento: formData.numero_documento || undefined,
      observacoes: formData.observacoes || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Editar Documento</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Total
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor_total}
                onChange={(e) => setFormData(prev => ({ ...prev, valor_total: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <input
                type="text"
                value={formData.empresa_emitente}
                onChange={(e) => setFormData(prev => ({ ...prev, empresa_emitente: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número do Documento
              </label>
              <input
                type="text"
                value={formData.numero_documento}
                onChange={(e) => setFormData(prev => ({ ...prev, numero_documento: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}