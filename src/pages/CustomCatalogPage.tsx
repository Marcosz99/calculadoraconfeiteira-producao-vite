import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function CustomCatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Catálogo Personalizado</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">🍰 Catálogo Personalizado</h2>
          <p className="text-gray-600">
            Esta página está sendo configurada para o ambiente Replit. 
            Em breve você poderá criar catálogos personalizados para seus produtos.
          </p>
          <div className="mt-6">
            <Link
              to="/dashboard"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}