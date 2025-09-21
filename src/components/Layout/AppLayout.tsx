import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calculator, Home, FileText, Users, Menu, X, Bell, Settings, User, Package, BarChart3, DollarSign, Plus, MessageSquare, Bot, ShoppingBag, Palette } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import CreditsDisplay from '../CreditsDisplay'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // 6 principais funcionalidades
  const mainNavigation = [
    { name: 'Início', href: '/dashboard', icon: Home },
    { name: 'Calculadora', href: '/calculadora', icon: Calculator },
    { name: 'Receitas', href: '/receitas', icon: FileText },
    { name: 'Ingredientes', href: '/ingredientes', icon: Package },
    { name: 'Comunidade', href: '/comunidade', icon: Users },
    { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
    { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
  ]

  // Funcionalidades secundárias
  const moreItems = [
    { name: 'Clientes', href: '/clientes', icon: Users },
    { name: 'Orçamentos', href: '/orcamentos', icon: FileText },
    { name: 'Catálogo', href: '/custom-catalog', icon: Palette },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'DoceBot IA', href: '/ai-assistant', icon: Bot },
  ]

  // Mobile navigation (4 principais + Mais)
  const mobileNavigation = [
    { name: 'Início', href: '/dashboard', icon: Home },
    { name: 'Calculadora', href: '/calculadora', icon: Calculator },
    { name: 'Receitas', href: '/receitas', icon: FileText },
    { name: 'Comunidade', href: '/comunidade', icon: Users },
  ]

  const [showMoreModal, setShowMoreModal] = useState(false)

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
              {mainNavigation.map((item) => {
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
            className="hidden lg:flex items-center justify-center w-12 h-12 border-r border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset transition-colors"
            style={{ '--tw-ring-color': 'var(--primary)' } as React.CSSProperties}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <Menu className="h-5 w-5" />
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
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="relative flex items-center space-x-2">
                <Link to="/perfil" className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50">
                  {profile?.foto_perfil ? (
                    <img 
                      src={profile.foto_perfil} 
                      alt="Foto de perfil" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-pink-600" />
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {profile?.nome || user?.email?.split('@')[0] || 'Perfil'}
                  </span>
                </Link>
                <button 
                  onClick={signOut}
                  className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
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
          {mobileNavigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center space-y-1 ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}
                style={isActive ? { backgroundColor: 'var(--primary)' } : {}}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </Link>
            )
          })}
          
          <button
            className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-gray-600"
            onClick={() => setShowMoreModal(true)}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Mais</span>
          </button>
        </div>
      </div>

      {/* Modal "Mais Funcionalidades" - Mobile */}
      {showMoreModal && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowMoreModal(false)}></div>
            
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Mais Funcionalidades</h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setShowMoreModal(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[...moreItems, { name: 'Relatórios', href: '/relatorios', icon: BarChart3 }, { name: 'Financeiro', href: '/financeiro', icon: DollarSign }].map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-colors"
                    onClick={() => setShowMoreModal(false)}
                  >
                    <div className="p-3 rounded-lg bg-gray-100 mb-2">
                      <item.icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}