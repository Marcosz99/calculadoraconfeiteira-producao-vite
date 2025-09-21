import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calculator, Home, FileText, Users, Menu, X, Bell, Settings, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import CreditsDisplay from '../CreditsDisplay'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Início', href: '/dashboard', icon: Home },
    { name: 'Calcular', href: '/calculadora', icon: Calculator },
    { name: 'Receitas', href: '/receitas', icon: FileText },
    { name: 'Ingredientes', href: '/ingredientes', icon: FileText },
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Orçamentos', href: '/orcamentos', icon: FileText },
    { name: 'Relatórios', href: '/relatorios', icon: FileText },
    { name: 'Comunidade', href: '/comunidade', icon: Users },
  ]

  const moreItems = [
    { name: 'Catálogo', href: '/custom-catalog', icon: FileText },
    { name: 'Marketplace', href: '/marketplace', icon: FileText },
    { name: 'DoceBot IA', href: '/ai-assistant', icon: FileText },
    { name: 'Financeiro', href: '/financeiro', icon: FileText },
  ]

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar Desktop */}
      <div className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="flex flex-col w-full">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-r border-gray-200">
            <Calculator className="h-8 w-8" style={{ color: 'var(--primary)' }} />
            {sidebarOpen && (
              <span className="ml-2 text-xl font-bold text-gray-900">DoceCalc</span>
            )}
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto bg-white border-r border-gray-200">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    style={isActive ? { backgroundColor: 'var(--primary)' } : {}}
                  >
                    <item.icon className={`flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`} />
                    {sidebarOpen && (
                      <span className="ml-3">{item.name}</span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button
            className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset lg:hidden"
            style={{ '--tw-ring-color': 'var(--primary)' } as React.CSSProperties}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <button
            className="hidden lg:flex px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset"
            style={{ '--tw-ring-color': 'var(--primary)' } as React.CSSProperties}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-gray-900">
                  Olá, {profile?.nome || user?.email?.split('@')[0] || 'Confeiteira'}! 👋
                </h1>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <CreditsDisplay />
              
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="relative flex items-center space-x-2">
                <Link to="/perfil" className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                  <User className="h-5 w-5" />
                </Link>
                <button 
                  onClick={signOut}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>

      {/* Mobile Navigation - Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 h-16">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center space-y-1 ${
              location.pathname === '/dashboard' ? 'text-white' : 'text-gray-400'
            }`}
            style={location.pathname === '/dashboard' ? { backgroundColor: 'var(--primary)' } : {}}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Início</span>
          </Link>
          
          <Link
            to="/calculadora"
            className={`flex flex-col items-center justify-center space-y-1 ${
              location.pathname === '/calculadora' ? 'text-white' : 'text-gray-400'
            }`}
            style={location.pathname === '/calculadora' ? { backgroundColor: 'var(--primary)' } : {}}
          >
            <Calculator className="h-5 w-5" />
            <span className="text-xs">Calcular</span>
          </Link>
          
          <Link
            to="/receitas"
            className={`flex flex-col items-center justify-center space-y-1 ${
              location.pathname === '/receitas' ? 'text-white' : 'text-gray-400'
            }`}
            style={location.pathname === '/receitas' ? { backgroundColor: 'var(--primary)' } : {}}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs">Receitas</span>
          </Link>
          
          <Link
            to="/comunidade"
            className={`flex flex-col items-center justify-center space-y-1 ${
              location.pathname === '/comunidade' ? 'text-white' : 'text-gray-400'
            }`}
            style={location.pathname === '/comunidade' ? { backgroundColor: 'var(--primary)' } : {}}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs">Comunidade</span>
          </Link>
          
          <button
            className="flex flex-col items-center justify-center space-y-1 text-gray-400"
            onClick={() => {/* TODO: Abrir modal "Mais" */}}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs">Mais</span>
          </button>
        </div>
      </div>
    </div>
  )
}