// Utilitários para gerenciar dados no localStorage

export const LOCAL_STORAGE_KEYS = {
  USER: 'doce_user',
  PERFIL_CONFEITARIA: 'doce_perfil_confeitaria',
  RECEITAS: 'doce_receitas',
  INGREDIENTES_USUARIO: 'doce_ingredientes_usuario',
  CATEGORIAS: 'doce_categorias',
  CLIENTES: 'doce_clientes',
  ORCAMENTOS: 'doce_orcamentos',
  PEDIDOS: 'doce_pedidos',
  CONFIGURACOES: 'doce_configuracoes',
  STATS_DASHBOARD: 'doce_stats_dashboard'
}

export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error)
  }
}

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Erro ao ler do localStorage:', error)
    return defaultValue
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Erro ao remover do localStorage:', error)
  }
}

export function clearAllUserData(): void {
  Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
    removeFromLocalStorage(key)
  })
}

// Função para inicializar dados padrão
export function initializeDefaultData(userId: string): void {
  // Categorias padrão
  const categoriasDefault = [
    { id: '1', usuario_id: userId, nome: 'Bolos', cor_hex: '#FF6B6B', icone: '🎂', ordem: 1 },
    { id: '2', usuario_id: userId, nome: 'Doces', cor_hex: '#4ECDC4', icone: '🍬', ordem: 2 },
    { id: '3', usuario_id: userId, nome: 'Salgados', cor_hex: '#45B7D1', icone: '🥧', ordem: 3 },
    { id: '4', usuario_id: userId, nome: 'Tortas', cor_hex: '#96CEB4', icone: '🥧', ordem: 4 },
    { id: '5', usuario_id: userId, nome: 'Sobremesas', cor_hex: '#FFEAA7', icone: '🍰', ordem: 5 }
  ]

  const configuracaoDefault = {
    id: '1',
    usuario_id: userId,
    moeda: 'BRL',
    fuso_horario: 'America/Sao_Paulo',
    margem_padrao: 30,
    custo_hora_trabalho: 25.00,
    notificacoes_email: true,
    notificacoes_whatsapp: true
  }

  saveToLocalStorage(LOCAL_STORAGE_KEYS.CATEGORIAS, categoriasDefault)
  saveToLocalStorage(LOCAL_STORAGE_KEYS.CONFIGURACOES, configuracaoDefault)
  saveToLocalStorage(LOCAL_STORAGE_KEYS.INGREDIENTES_USUARIO, [])
  saveToLocalStorage(LOCAL_STORAGE_KEYS.RECEITAS, [])
  saveToLocalStorage(LOCAL_STORAGE_KEYS.CLIENTES, [])
  saveToLocalStorage(LOCAL_STORAGE_KEYS.ORCAMENTOS, [])
  saveToLocalStorage(LOCAL_STORAGE_KEYS.PEDIDOS, [])
}