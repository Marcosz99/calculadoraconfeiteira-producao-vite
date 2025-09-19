import { useAuth } from '@/contexts/AuthContext'

export const ResetPlanButton = () => {
  const { profile, updateProfile } = useAuth()

  if (!profile) return null

  const resetToFree = async () => {
    if (confirm('Resetar seu plano para FREE para testar a funcionalidade de upgrade?')) {
      try {
        await updateProfile({ plano: 'free' })
        alert('Plano resetado para FREE! Agora você pode testar o upgrade.')
      } catch (error) {
        console.error('Erro ao resetar plano:', error)
      }
    }
  }

  if (profile.plano === 'free') return null

  return (
    <button
      onClick={resetToFree}
      className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors z-50"
    >
      Resetar para FREE (Teste)
    </button>
  )
}