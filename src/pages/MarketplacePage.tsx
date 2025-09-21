import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Clock, Star } from 'lucide-react'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-4">
          <Link 
            to="/dashboard"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Marketplace 🛒
            </h1>
            <p className="text-gray-600">
              E-books e cursos especializados para confeiteiros
            </p>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Marketplace em Desenvolvimento
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Estamos preparando uma seleção incrível de e-books, cursos e materiais 
              exclusivos para turbinar seu negócio de confeitaria!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">E-books Exclusivos</h3>
              <p className="text-blue-700 text-sm">
                Receitas secretas, técnicas avançadas e guias de negócio
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Cursos Online</h3>
              <p className="text-green-700 text-sm">
                Videoaulas passo a passo com confeiteiros renomados
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-purple-900 mb-2">Materiais Premium</h3>
              <p className="text-purple-700 text-sm">
                Templates, planilhas e ferramentas para seu negócio
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white mb-8">
            <h3 className="text-xl font-bold mb-2">🚀 Lançamento em Breve!</h3>
            <p className="mb-4">
              Enquanto preparamos o marketplace, aproveite todas as ferramentas gratuitas do DoceCalc
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link 
                to="/calculadora"
                className="bg-white text-orange-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Calculadora
              </Link>
              <Link 
                to="/receitas"
                className="bg-white text-orange-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Receitas
              </Link>
              <Link 
                to="/comunidade"
                className="bg-white text-orange-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Comunidade
              </Link>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            Quer ser notificado quando o marketplace estiver pronto? 
            <Link to="/perfil" className="text-blue-600 hover:underline ml-1">
              Atualize seu perfil
            </Link> e receba as novidades em primeira mão!
          </p>
        </div>
      </div>
    </div>
  )
}