import React, { useState } from 'react'
import { Upload, Camera, X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface RecipePhotoUploadProps {
  currentPhoto?: string
  onPhotoUpdate: (photoUrl: string) => void
  recipeId?: string
  size?: 'small' | 'medium' | 'large'
}

export default function RecipePhotoUpload({ 
  currentPhoto, 
  onPhotoUpdate, 
  recipeId,
  size = 'medium' 
}: RecipePhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  }

  const uploadPhoto = async (file: File) => {
    try {
      setUploading(true)

      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem')
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('O arquivo deve ter no máximo 5MB')
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${recipeId || Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `receitas/${fileName}`

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('receitas')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('receitas')
        .getPublicUrl(filePath)

      onPhotoUpdate(publicUrl)
      
      toast({
        title: "Foto enviada!",
        description: "A foto da receita foi atualizada com sucesso.",
      })

    } catch (error: any) {
      console.error('Erro no upload:', error)
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadPhoto(file)
    }
  }

  const removePhoto = () => {
    onPhotoUpdate('')
    toast({
      title: "Foto removida",
      description: "A foto da receita foi removida.",
    })
  }

  return (
    <div className="flex items-center space-x-4">
      <div className={`${sizeClasses[size]} border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative group overflow-hidden`}>
        {currentPhoto ? (
          <>
            <img 
              src={currentPhoto} 
              alt="Foto da receita" 
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={removePhoto}
                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                title="Remover foto"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
            ) : (
              <Camera className="h-6 w-6 text-gray-400" />
            )}
          </div>
        )}
      </div>
      
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id={`photo-upload-${recipeId || 'new'}`}
          disabled={uploading}
        />
        <label
          htmlFor={`photo-upload-${recipeId || 'new'}`}
          className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Enviando...' : currentPhoto ? 'Trocar Foto' : 'Adicionar Foto'}
        </label>
        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG até 5MB
        </p>
      </div>
    </div>
  )
}