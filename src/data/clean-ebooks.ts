// Clean data - no mock data for production
export const categories = []
export const ebooks = []

export const getUserLibrary = () => {
  return []
}

export const getCart = () => {
  return []
}

export const saveCart = (cart: any[]) => {
  // Real implementation would save to Supabase
}

export const simulatePurchase = (ebookIds: string[], paymentMethod: 'creditos' | 'dinheiro') => {
  // Real implementation would process through payment gateway
  return Promise.resolve({ success: false, message: 'Feature not implemented yet' })
}