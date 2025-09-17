'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, Search, User, Settings, LogOut, Crown, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const pageNames: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/dashboard/calculadora': 'Calculadora de Preços',
  '/dashboard/receitas': 'Minhas Receitas',
  '/dashboard/ingredientes': 'Base de Ingredientes',
  '/dashboard/orcamentos': 'Orçamentos',
  '/dashboard/relatorios': 'Relatórios',
  '/dashboard/configuracoes': 'Configurações',
  '/dashboard/ajuda': 'Central de Ajuda',
}

export function Header() {
  const { profile, signOut } = useAuth()
  const pathname = usePathname()
  
  const currentPageName = pageNames[pathname] || 'Dashboard'
  const isPro = profile?.plano === 'pro'

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Page title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-display font-semibold text-gray-900">
            {currentPageName}
          </h1>
          
          {/* Pro badge se for página PRO */}
          {(pathname.includes('orcamentos') || pathname.includes('relatorios')) && (
            <Badge className="bg-gradient-doce text-white">
              <Crown className="h-3 w-3 mr-1" />
              PRO
            </Badge>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search (future feature) */}
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications (future feature) */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          </Button>

          {/* Upgrade button for free users */}
          {!isPro && (
            <Link href="/dashboard/upgrade">
              <Button variant="doce" size="sm" className="hidden md:flex">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade PRO
              </Button>
            </Link>
          )}

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <div className="w-10 h-10 bg-gradient-doce rounded-full flex items-center justify-center text-white font-medium">
                  {profile?.nome?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile?.nome || 'Usuário'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant={isPro ? "default" : "secondary"} 
                      className={isPro ? "bg-gradient-doce text-white" : ""}
                    >
                      {isPro && <Crown className="h-3 w-3 mr-1" />}
                      {isPro ? 'Profissional' : 'Gratuito'}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link href="/dashboard/configuracoes" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/dashboard/configuracoes" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/dashboard/ajuda" className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Ajuda</span>
                </Link>
              </DropdownMenuItem>
              
              {!isPro && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/upgrade" className="cursor-pointer text-primary">
                      <Crown className="mr-2 h-4 w-4" />
                      <span>Upgrade para PRO</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}