import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Building2, Settings, Upload, Save, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface UserConfig {
  custo_hora_trabalho?: number
  margem_padrao?: number
  moeda?: string
  fuso_horario?: string
  notificacoes_email?: boolean
  notificacoes_whatsapp?: boolean
}

interface PerfilNegocio {
  data_nascimento?: string
  logo_confeitaria?: string
  tipo_negocio?: 'hobby' | 'mei' | 'empresa'
  tempo_experiencia?: number
  especialidades?: string[]
  faturamento_mensal?: number
  numero_funcionarios?: number
  principais_produtos?: string[]
  cpf?: string
}

export default function PerfilPage() {
  const { user, profile, updateProfile } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState<UserConfig>({})
  const [perfilNegocio, setPerfilNegocio] = useState<PerfilNegocio>({})
  const [formData, setFormData] = useState({
    nome: '',
    nome_negocio: '',
    telefone: '',
    whatsapp: '',
    instagram: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    bio: '',
  })

  // Carregar dados do usuário
  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.nome || '',
        nome_negocio: profile.nome_negocio || '',
        telefone: profile.telefone || '',
        whatsapp: profile.whatsapp || '',
        instagram: profile.instagram || '',
        endereco: profile.endereco || '',
        cidade: profile.cidade || '',
        estado: profile.estado || '',
        cep: profile.cep || '',
        bio: profile.bio || '',
      })
      
      // Carregar configurações do usuário
      loadUserConfig()
    }
  }, [profile])

  const loadUserConfig = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('configuracoes_usuario')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data && !error) {
        setConfig({
          custo_hora_trabalho: data.custo_hora_trabalho || 25,
          margem_padrao: data.margem_padrao || 30,
          moeda: data.moeda || 'BRL',
          fuso_horario: data.fuso_horario || 'America/Sao_Paulo',
          notificacoes_email: data.notificacoes_email ?? true,
          notificacoes_whatsapp: data.notificacoes_whatsapp ?? true,
        })
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleConfigChange = (field: keyof UserConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePerfilNegocioChange = (field: keyof PerfilNegocio, value: any) => {
    setPerfilNegocio(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const buscarEnderecoPorCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        const data = await response.json()
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            endereco: data.logradouro || '',
            cidade: data.localidade || '',
            estado: data.uf || ''
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Atualizar perfil básico
      await updateProfile(formData)

      // Atualizar configurações
      const { error: configError } = await supabase
        .from('configuracoes_usuario')
        .upsert({
          user_id: user.id,
          ...config,
          updated_at: new Date().toISOString()
        })

      if (configError) throw configError

      toast({
        title: "Perfil salvo!",
        description: "Suas informações foram atualizadas com sucesso.",
      })

    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUploadPhoto = () => {
    // Simular upload de foto - em produção usar Cloudinary ou similar
    toast({
      title: "Upload de foto",
      description: "Funcionalidade será implementada em breve com Cloudinary.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais e do negócio</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pessoais" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pessoais" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="negocio" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Negócio
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dados Pessoais */}
          <TabsContent value="pessoais">
            <Card className="p-6">
              <div className="space-y-6">
                {/* Foto do Perfil */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                    {profile?.foto_perfil ? (
                      <img 
                        src={profile.foto_perfil} 
                        alt="Foto do perfil" 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-purple-600" />
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleUploadPhoto}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Alterar Foto
                  </Button>
                </div>

                {/* Formulário Dados Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', formatTelefone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', formatTelefone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="@seuusuario"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => {
                        const formatted = formatCEP(e.target.value)
                        handleInputChange('cep', formatted)
                        if (formatted.length === 9) {
                          buscarEnderecoPorCEP(formatted)
                        }
                      }}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      placeholder="Rua, número, bairro"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                      placeholder="Sua cidade"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                      placeholder="UF"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografia / Apresentação</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Conte um pouco sobre você e sua paixão pela confeitaria..."
                    className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.bio.length}/500 caracteres
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Dados do Negócio */}
          <TabsContent value="negocio">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome_negocio">Nome da Confeitaria *</Label>
                    <Input
                      id="nome_negocio"
                      value={formData.nome_negocio}
                      onChange={(e) => handleInputChange('nome_negocio', e.target.value)}
                      placeholder="Nome do seu negócio"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tipo_negocio">Tipo de Negócio</Label>
                    <select
                      id="tipo_negocio"
                      value={perfilNegocio.tipo_negocio || ''}
                      onChange={(e) => handlePerfilNegocioChange('tipo_negocio', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Selecione</option>
                      <option value="hobby">Hobby / Diversão</option>
                      <option value="mei">MEI / Microempreendedor</option>
                      <option value="empresa">Empresa / Confeitaria</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="tempo_experiencia">Tempo de Experiência (anos)</Label>
                    <Input
                      id="tempo_experiencia"
                      type="number"
                      min="0"
                      max="50"
                      value={perfilNegocio.tempo_experiencia || ''}
                      onChange={(e) => handlePerfilNegocioChange('tempo_experiencia', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="numero_funcionarios">Número de Funcionários</Label>
                    <Input
                      id="numero_funcionarios"
                      type="number"
                      min="0"
                      value={perfilNegocio.numero_funcionarios || ''}
                      onChange={(e) => handlePerfilNegocioChange('numero_funcionarios', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="especialidades">Especialidades</Label>
                  <textarea
                    id="especialidades"
                    value={perfilNegocio.especialidades?.join(', ') || ''}
                    onChange={(e) => handlePerfilNegocioChange('especialidades', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="Ex: Bolos personalizados, Brigadeiros gourmet, Tortas geladas, Docinhos finos..."
                    className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separe por vírgulas
                  </p>
                </div>

                <div>
                  <Label htmlFor="principais_produtos">Principais Produtos</Label>
                  <textarea
                    id="principais_produtos"
                    value={perfilNegocio.principais_produtos?.join(', ') || ''}
                    onChange={(e) => handlePerfilNegocioChange('principais_produtos', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="Ex: Bolo de chocolate, Brigadeiro tradicional, Torta de limão..."
                    className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separe por vírgulas
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="configuracoes">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Configurações do Negócio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="custo_hora">Custo por Hora de Trabalho (R$)</Label>
                      <Input
                        id="custo_hora"
                        type="number"
                        min="0"
                        step="0.01"
                        value={config.custo_hora_trabalho || ''}
                        onChange={(e) => handleConfigChange('custo_hora_trabalho', parseFloat(e.target.value) || 0)}
                        placeholder="25.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="margem_padrao">Margem de Lucro Padrão (%)</Label>
                      <Input
                        id="margem_padrao"
                        type="number"
                        min="0"
                        max="100"
                        value={config.margem_padrao || ''}
                        onChange={(e) => handleConfigChange('margem_padrao', parseFloat(e.target.value) || 0)}
                        placeholder="30"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Notificações</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        id="notif_email"
                        type="checkbox"
                        checked={config.notificacoes_email || false}
                        onChange={(e) => handleConfigChange('notificacoes_email', e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <Label htmlFor="notif_email">Receber notificações por email</Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        id="notif_whats"
                        type="checkbox"
                        checked={config.notificacoes_whatsapp || false}
                        onChange={(e) => handleConfigChange('notificacoes_whatsapp', e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <Label htmlFor="notif_whats">Receber notificações por WhatsApp</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Plano Atual</h3>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Plano {profile?.plano === 'professional' ? 'Profissional' : 'Gratuito'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile?.plano === 'professional' 
                            ? 'Acesso a todas as funcionalidades premium' 
                            : 'Funcionalidades básicas disponíveis'
                          }
                        </p>
                      </div>
                      {profile?.plano === 'free' && (
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/upgrade')}
                          className="text-purple-600 border-purple-600 hover:bg-purple-50"
                        >
                          Fazer Upgrade
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botão Salvar Fixo */}
        <div className="fixed bottom-6 right-6">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>
    </div>
  )
}