import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Calculator, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PixelService } from '../services/pixelService'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [nomeConfeitaria, setNomeConfeitaria] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [error, setError] = useState('')
  const { signIn, signUp, resetPassword, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        const result = await signUp(email, password, nome, nomeConfeitaria)
        // Disparar evento CompleteRegistration quando o usuário se cadastra
        PixelService.trackCompleteRegistration({
          email: email,
          name: nome
        })
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) return
    
    try {
      await resetPassword(resetEmail)
      setShowForgotPassword(false)
      setResetEmail('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao enviar email')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🧁</div>
        <div className="absolute top-20 right-20 text-4xl">🍰</div>
        <div className="absolute bottom-20 left-20 text-5xl">🎂</div>
        <div className="absolute bottom-10 right-10 text-3xl">🍪</div>
        <div className="absolute top-1/2 left-1/3 text-2xl">🥧</div>
      </div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 animate-scale-in relative z-10">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-bounce-in">
              <Calculator className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DoceCalc</h1>
          <p className="text-gray-600">Calculadora de Preços para Confeiteiras</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu Nome
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-500"
                    placeholder="Seu nome completo"
                    required={!isLogin}
                  />
                </div>
              </div>
              
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Confeitaria
                </label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={nomeConfeitaria}
                    onChange={(e) => setNomeConfeitaria(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-500"
                    placeholder="Nome da sua confeitaria"
                    required={!isLogin}
                  />
                </div>
              </div>
            </>
          )}

          <div className="animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-500"
                  placeholder="seu@email.com"
                  required
                />
            </div>
          </div>

          <div className="animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-500"
                  placeholder="Sua senha"
                  required
                />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 hover-scale"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Carregando...</span>
              </div>
            ) : (
              isLogin ? 'Entrar' : 'Cadastrar'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-3">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-500 hover:text-pink-600 font-medium transition-colors story-link"
          >
            {isLogin ? 'Criar conta gratuita' : 'Fazer login'}
          </button>
        </div>


        {/* Features Preview */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="p-2">
            <div className="text-2xl mb-1">🧮</div>
            <p className="text-xs text-gray-600">Calculadora</p>
          </div>
          <div className="p-2">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-gray-600">Relatórios</p>
          </div>
          <div className="p-2">
            <div className="text-2xl mb-1">💰</div>
            <p className="text-xs text-gray-600">Lucro Real</p>
          </div>
        </div>
      </div>
    </div>
  )
}