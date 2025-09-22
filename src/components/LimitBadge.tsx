import { Crown } from 'lucide-react'
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits'

interface LimitBadgeProps {
  type: 'receitas' | 'ingredientes'
  className?: string
}

export const LimitBadge = ({ type, className = '' }: LimitBadgeProps) => {
  const { isProfessional, usage, limits, getUsagePercentage } = useSubscriptionLimits()
  
  if (isProfessional) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium ${className}`}>
        <Crown className="w-3 h-3" />
        Ilimitado
      </div>
    )
  }
  
  const current = usage[type]
  const limit = limits[type] as number
  const percentage = getUsagePercentage(type)
  
  const getColor = () => {
    if (percentage >= 100) return 'bg-red-100 text-red-800'
    if (percentage >= 80) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColor()} ${className}`}>
      {current}/{limit}
    </div>
  )
}