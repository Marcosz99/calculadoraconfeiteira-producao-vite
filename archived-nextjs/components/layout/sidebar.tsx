'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calculator,
  ChefHat,
  Package,
  FileText,
  Settings,
  Cake,
  Crown,
  HelpCircle,
  BarChart3
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral do negócio'
  },
  {
    name: 'Calculadora',
    href: '/dashboard/calculadora',
    icon: Calculator,
    description: 'Calcular preços',
    highlight: true
  },
  {
    name: 'Receitas',
    href: '/dashboard/receitas',
    icon: ChefHat,
    description: 'Gerenciar receitas'
  },
  {
    name: 'Ingredientes',
    href: '/dashboard/ingredientes',
    icon: Package,
    description: 'Base de ingredientes'
  },
  {
    name: 'Orçamentos',
    href: '/dashboard/orcamentos',
    icon: FileText,
    description: 'Orçamentos para clientes',
    pro: true
  },
  {
    name: 'Relatórios',
    href: '/dashboard/relatorios',
    icon: BarChart3,
    description: 'Análises e relatórios',
    pro: true
  },
]

const bottomNavigation = [
  {
    name: 'Configurações',
    href: '/dashboard/configuracoes',
    icon: Settings,
    description: 'Suas configurações'
  },
  {
    name: 'Ajuda',
    href: '/dashboard/ajuda',
    icon: HelpCircle,
    description: 'Central de ajuda'
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile } = useAuth()

  const isPro = profile?.plano === 'pro'

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Cake className="h-8 w-8 text-primary" />
            <div>
              <span className="text-xl font-display font-bold text-gray-900">DoceCalc</span>
              {isPro && (
                <Badge className="ml-2 bg-gradient-doce text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  PRO
                </Badge>
              )}
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-doce rounded-full flex items-center justify-center text-white font-medium">
              {profile?.nome?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.nome || 'Usuário'}
              </p>
              <p className="text-xs text-gray-600 truncate">
                Plano {isPro ? 'Profissional' : 'Gratuito'}
              </p>
            </div>
          </div>
          
          {!isPro && (
            <Link href="/dashboard/upgrade">
              <div className="mt-3 p-2 bg-gradient-to-r from-primary/10 to-rosa-500/10 rounded-lg border border-primary/20 cursor-pointer hover:from-primary/15 hover:to-rosa-500/15 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-medium text-primary">Upgrade para PRO</p>
                    <p className="text-gray-600">Desbloquear tudo</p>
                  </div>
                  <Crown className="h-4 w-4 text-primary" />
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const needsPro = item.pro && !isPro
            
            return (
              <Link
                key={item.name}
                href={needsPro ? '/dashboard/upgrade' : item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : needsPro
                    ? 'text-gray-400 hover:text-gray-500 cursor-pointer'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                  item.highlight && !isActive && !needsPro && 'ring-1 ring-primary/30 bg-primary/5'
                )}
              >
                <item.icon 
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-white' : needsPro ? 'text-gray-400' : 'text-gray-500'
                  )} 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.pro && (
                      <Crown className="h-3 w-3 text-primary opacity-60" />
                    )}
                    {item.highlight && !isActive && (
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className={cn(
                    'text-xs mt-0.5',
                    isActive ? 'text-white/80' : needsPro ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="border-t border-gray-200 p-4 space-y-1">
          {bottomNavigation.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon 
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-white' : 'text-gray-500'
                  )} 
                />
                <div>
                  <span>{item.name}</span>
                  <p className={cn(
                    'text-xs',
                    isActive ? 'text-white/80' : 'text-gray-500'
                  )}>
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}