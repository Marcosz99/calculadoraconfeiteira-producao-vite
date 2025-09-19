import React from 'react'
import { Cloud, Database, ArrowRight, CheckCircle, Loader, X } from 'lucide-react'
import { useMigration } from '@/hooks/useMigration'

interface MigrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const MigrationModal: React.FC<MigrationModalProps> = ({ isOpen, onClose }) => {
  const { migrateToSupabase, migrating, migrationStatus } = useMigration()

  if (!isOpen) return null

  const handleMigrate = () => {
    migrateToSupabase()
  }

  const totalSteps = Object.keys(migrationStatus).length
  const completedSteps = Object.values(migrationStatus).filter(Boolean).length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Migração para Nuvem
          </h2>
          {!migrating && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400" />
            <div className="bg-green-100 p-3 rounded-full">
              <Cloud className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <p className="text-gray-600">
            Migre seus dados do navegador para a nuvem segura do Supabase.
            Seus dados ficarão protegidos e sincronizados entre dispositivos.
          </p>
        </div>

        {migrating && (
          <div className="space-y-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-900 mb-2">
                Migrando dados... ({completedSteps}/{totalSteps})
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(migrationStatus).map(([key, completed]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{key}</span>
                  {completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Loader className="h-4 w-4 text-blue-500 animate-spin" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!migrating && (
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">O que será migrado:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Receitas e ingredientes</li>
                <li>• Clientes e orçamentos</li>
                <li>• Categorias e configurações</li>
                <li>• Todos os dados pessoais</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Importante:</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• A migração é irreversível</li>
                <li>• Dados locais serão removidos após migração</li>
                <li>• Mantenha a internet conectada</li>
              </ul>
            </div>
          </div>
        )}

        {!migrating ? (
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleMigrate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Cloud className="h-4 w-4" />
              <span>Migrar Agora</span>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Aguarde enquanto seus dados são migrados...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}