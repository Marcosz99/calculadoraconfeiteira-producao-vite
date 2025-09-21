import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Upload, Edit } from 'lucide-react'

interface FinancialActionButtonsProps {
  onUploadReceita: () => void
  onUploadDespesa: () => void
  onManualReceita: () => void
  onManualDespesa: () => void
}

export function FinancialActionButtons({
  onUploadReceita,
  onUploadDespesa,
  onManualReceita,
  onManualDespesa
}: FinancialActionButtonsProps) {
  const [showReceitaMenu, setShowReceitaMenu] = useState(false)
  const [showDespesaMenu, setShowDespesaMenu] = useState(false)

  return (
    <div className="flex items-center space-x-3">
      {/* Dropdown Receita */}
      <div className="relative">
        <button 
          onClick={() => setShowReceitaMenu(!showReceitaMenu)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          + Receita
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showReceitaMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-20">
            <div className="py-2">
              <button
                onClick={() => {
                  onUploadReceita()
                  setShowReceitaMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Upload className="h-4 w-4 mr-3 text-green-600" />
                <div>
                  <div className="font-medium">📄 Upload Comprovante</div>
                  <div className="text-xs text-gray-500">IA extrai dados automaticamente</div>
                </div>
              </button>
              <button
                onClick={() => {
                  onManualReceita()
                  setShowReceitaMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Edit className="h-4 w-4 mr-3 text-green-600" />
                <div>
                  <div className="font-medium">✏️ Preencher Manual</div>
                  <div className="text-xs text-gray-500">Digite os dados diretamente</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Click outside to close */}
        {showReceitaMenu && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowReceitaMenu(false)}
          />
        )}
      </div>

      {/* Dropdown Despesa */}
      <div className="relative">
        <button 
          onClick={() => setShowDespesaMenu(!showDespesaMenu)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
        >
          <TrendingDown className="h-4 w-4 mr-2" />
          + Despesa
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showDespesaMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-20">
            <div className="py-2">
              <button
                onClick={() => {
                  onUploadDespesa()
                  setShowDespesaMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Upload className="h-4 w-4 mr-3 text-red-600" />
                <div>
                  <div className="font-medium">📄 Upload Comprovante</div>
                  <div className="text-xs text-gray-500">IA extrai dados automaticamente</div>
                </div>
              </button>
              <button
                onClick={() => {
                  onManualDespesa()
                  setShowDespesaMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Edit className="h-4 w-4 mr-3 text-red-600" />
                <div>
                  <div className="font-medium">✏️ Preencher Manual</div>
                  <div className="text-xs text-gray-500">Digite os dados diretamente</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Click outside to close */}
        {showDespesaMenu && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDespesaMenu(false)}
          />
        )}
      </div>
    </div>
  )
}