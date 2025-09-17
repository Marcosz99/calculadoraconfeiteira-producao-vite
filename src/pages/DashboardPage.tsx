import React from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, Users, DollarSign } from 'lucide-react'

export default function DashboardPage() {
  // TODO: [REMOVIDO] Dados do banco PostgreSQL estavam aqui
  // Implementar: Usar localStorage para stats básicas
  
  const mockStats = {
    totalReceitas: 15,
    receitasCalculadas: 8,
    economiaMediaMensal: 450.50,
    ingredientesAtivos: 25
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            DoceCalc Dashboard
          </h1>
          <p className="text-gray-600">
            Calculadora de Preços para Confeiteiras
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalReceitas}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Calculadas</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.receitasCalculadas}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Economia Mensal</p>
                <p className="text-2xl font-bold text-gray-900">R$ {mockStats.economiaMediaMensal}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingredientes</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.ingredientesAtivos}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            to="/calculadora"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Calculator className="h-10 w-10 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Calculadora</h3>
                <p className="text-gray-600">Calcule o preço dos seus doces</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-md opacity-75">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-10 w-10 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-500">Receitas</h3>
                <p className="text-gray-400">Em breve...</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md opacity-75">
            <div className="flex items-center space-x-4">
              <Users className="h-10 w-10 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-500">Ingredientes</h3>
                <p className="text-gray-400">Em breve...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}