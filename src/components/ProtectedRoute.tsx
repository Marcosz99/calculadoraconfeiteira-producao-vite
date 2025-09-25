import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiresPro?: boolean
}

export default function ProtectedRoute({ children, requiresPro = false }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Redirecionar para login se não autenticado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Verificar se precisa do plano Pro
  if (requiresPro && profile?.plano !== 'professional') {
    return <Navigate to="/checkout" replace />
  }

  return <>{children}</>
}