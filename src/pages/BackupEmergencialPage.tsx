import React, { useState } from 'react'
import { Shield, Download, Upload, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import { supabase } from '@/integrations/supabase/client'

export default function BackupEmergencialPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState<{tipo: 'sucesso' | 'erro' | 'info', texto: string} | null>(null)

  const gerarBackupLocal = () => {
    try {
      const dadosBackup = {
        usuario: {
          id: user?.id,
          nome: user?.nome,
          email: user?.email,
          plano: user?.plano
        },
        receitas: getFromLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS, []),
        ingredientes: getFromLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, []),
        clientes: getFromLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES, []),
        orcamentos: getFromLocalStorage(LOCAL_STORAGE_KEYS.ORCAMENTOS, []),
        categorias: getFromLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIAS, []),
        configuracoes: getFromLocalStorage(LOCAL_STORAGE_KEYS.CONFIGURACOES, {}),
        dataBackup: new Date().toISOString(),
        versao: '1.0'
      }

      const dataStr = JSON.stringify(dadosBackup, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `backup-docecalc-${user?.nome?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setMensagem({
        tipo: 'sucesso',
        texto: 'Backup local criado e baixado com sucesso!'
      })
    } catch (error) {
      console.error('Erro ao gerar backup:', error)
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao gerar backup local. Tente novamente.'
      })
    }
  }

  const enviarBackupServidor = async () => {
    if (!user) {
      setMensagem({
        tipo: 'erro',
        texto: 'Usuário não está logado.'
      })
      return
    }

    setLoading(true)
    try {
      const dadosBackup = {
        receitas: getFromLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS, []),
        ingredientes: getFromLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, []),
        clientes: getFromLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES, []),
        orcamentos: getFromLocalStorage(LOCAL_STORAGE_KEYS.ORCAMENTOS, []),
        categorias: getFromLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIAS, []),
        configuracoes: getFromLocalStorage(LOCAL_STORAGE_KEYS.CONFIGURACOES, {}),
        dataBackup: new Date().toISOString(),
        versao: '1.0'
      }

      const { error } = await supabase
        .from('backups_usuarios')
        .insert({
          usuario_email: user.email,
          dados: dadosBackup,
          dispositivo: navigator.userAgent,
          versao: '1.0',
          observacoes: 'Backup emergencial criado pelo usuário'
        })

      if (error) throw error

      setMensagem({
        tipo: 'sucesso',
        texto: 'Backup enviado para o servidor com sucesso! Seus dados estão seguros.'
      })
    } catch (error) {
      console.error('Erro ao enviar backup:', error)
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao enviar backup para o servidor. Seus dados locais continuam seguros.'
      })
    } finally {
      setLoading(false)
    }
  }

  const restaurarBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string)
        
        // Validar estrutura do backup
        if (!backup.dataBackup || !backup.versao) {
          throw new Error('Arquivo de backup inválido')
        }

        // Confirmar restauração
        if (!window.confirm('ATENÇÃO: Esta ação sobrescreverá todos os seus dados atuais. Deseja continuar?')) {
          return
        }

        // Restaurar dados
        if (backup.receitas) saveToLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS, backup.receitas)
        if (backup.ingredientes) saveToLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, backup.ingredientes)
        if (backup.clientes) saveToLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES, backup.clientes)
        if (backup.orcamentos) saveToLocalStorage(LOCAL_STORAGE_KEYS.ORCAMENTOS, backup.orcamentos)
        if (backup.categorias) saveToLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIAS, backup.categorias)
        if (backup.configuracoes) saveToLocalStorage(LOCAL_STORAGE_KEYS.CONFIGURACOES, backup.configuracoes)

        setMensagem({
          tipo: 'sucesso',
          texto: 'Backup restaurado com sucesso! Recarregue a página para ver as alterações.'
        })

        // Recarregar página após 3 segundos
        setTimeout(() => {
          window.location.reload()
        }, 3000)

      } catch (error) {
        console.error('Erro ao restaurar backup:', error)
        setMensagem({
          tipo: 'erro',
          texto: 'Erro ao restaurar backup. Verifique se o arquivo está correto.'
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-10 w-10 text-red-500" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Backup Emergencial</h1>
              <p className="text-gray-600">Proteja seus dados importantes</p>
            </div>
          </div>
          
          {/* Alerta de Importância */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Importante:</strong> Faça backups regulares dos seus dados. Recomendamos fazer backup semanal ou antes de atualizações importantes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem de Status */}
        {mensagem && (
          <div className={`mb-6 p-4 rounded-lg ${
            mensagem.tipo === 'sucesso' ? 'bg-green-50 border border-green-200' :
            mensagem.tipo === 'erro' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex">
              {mensagem.tipo === 'sucesso' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {mensagem.tipo === 'erro' && <AlertTriangle className="h-5 w-5 text-red-500" />}
              {mensagem.tipo === 'info' && <Info className="h-5 w-5 text-blue-500" />}
              <div className="ml-3">
                <p className={`text-sm ${
                  mensagem.tipo === 'sucesso' ? 'text-green-700' :
                  mensagem.tipo === 'erro' ? 'text-red-700' :
                  'text-blue-700'
                }`}>
                  {mensagem.texto}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Criar Backup */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Criar Backup</h2>
            
            {/* Backup Local */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Download className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Backup Local</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Baixe um arquivo com todos os seus dados para guardar no seu computador ou nuvem pessoal.
              </p>
              <button
                onClick={gerarBackupLocal}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Baixar Backup Local
              </button>
              <div className="mt-3 text-sm text-gray-500">
                <p>✓ Inclui: receitas, ingredientes, clientes, orçamentos</p>
                <p>✓ Formato: arquivo JSON</p>
                <p>✓ Segurança: dados ficam apenas com você</p>
              </div>
            </div>

            {/* Backup no Servidor */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Backup no Servidor</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Envie uma cópia dos seus dados para nossos servidores seguros como backup emergencial.
              </p>
              <button
                onClick={enviarBackupServidor}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Enviando...' : 'Enviar para Servidor'}
              </button>
              <div className="mt-3 text-sm text-gray-500">
                <p>✓ Inclui: todos os seus dados</p>
                <p>✓ Segurança: criptografado e protegido</p>
                <p>✓ Acesso: apenas você e equipe técnica</p>
              </div>
            </div>
          </div>

          {/* Restaurar Backup */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Restaurar Backup</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Upload className="h-6 w-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">Restaurar do Arquivo</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Selecione um arquivo de backup para restaurar seus dados.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".json"
                  onChange={restaurarBackup}
                  className="hidden"
                  id="backup-file"
                />
                <label
                  htmlFor="backup-file"
                  className="cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Clique para selecionar arquivo de backup</p>
                  <p className="text-sm text-gray-500">Apenas arquivos .json são aceitos</p>
                </label>
              </div>

              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      <strong>Atenção:</strong> Restaurar um backup irá sobrescrever todos os seus dados atuais. 
                      Esta ação não pode ser desfeita.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Segurança */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Dicas de Segurança</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Faça backups regulares (semanal ou quinzenal)</li>
                <li>• Guarde backups em locais seguros (nuvem, HD externo)</li>
                <li>• Teste a restauração periodicamente</li>
                <li>• Mantenha múltiplas versões de backup</li>
                <li>• Nunca compartilhe arquivos de backup</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Estatísticas dos Dados */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo dos Seus Dados</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {getFromLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS, []).filter((r: any) => r.usuario_id === user?.id).length}
              </p>
              <p className="text-sm text-gray-600">Receitas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {getFromLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, []).filter((i: any) => i.usuario_id === user?.id).length}
              </p>
              <p className="text-sm text-gray-600">Ingredientes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {getFromLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES, []).filter((c: any) => c.usuario_id === user?.id).length}
              </p>
              <p className="text-sm text-gray-600">Clientes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">
                {getFromLocalStorage(LOCAL_STORAGE_KEYS.ORCAMENTOS, []).filter((o: any) => o.usuario_id === user?.id).length}
              </p>
              <p className="text-sm text-gray-600">Orçamentos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}