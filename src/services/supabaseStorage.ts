// Supabase Storage Service - Handle image uploads
import { supabase } from '@/integrations/supabase/client';

class SupabaseStorageService {
  private readonly BUCKETS = {
    AVATARS: 'avatars',
    RECEITAS: 'receitas',
    COMPROVANTES: 'comprovantes',
    LOGOS: 'logos'
  };

  // ===== AVATAR UPLOAD =====
  async uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from(this.BUCKETS.AVATARS)
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKETS.AVATARS)
        .getPublicUrl(fileName);

      return { url: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Erro no upload do avatar:', error);
      return { url: null, error: 'Erro interno no upload' };
    }
  }

  // ===== RECIPE IMAGES =====
  async uploadRecipeImage(userId: string, recipeId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${recipeId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(this.BUCKETS.RECEITAS)
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      const { data: urlData } = supabase.storage
        .from(this.BUCKETS.RECEITAS)
        .getPublicUrl(fileName);

      return { url: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Erro no upload da imagem da receita:', error);
      return { url: null, error: 'Erro interno no upload' };
    }
  }

  // ===== RECEIPT/DOCUMENT UPLOAD =====
  async uploadReceipt(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/receipt_${timestamp}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(this.BUCKETS.COMPROVANTES)
        .upload(fileName, file);

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      const { data: urlData } = supabase.storage
        .from(this.BUCKETS.COMPROVANTES)
        .getPublicUrl(fileName);

      return { url: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Erro no upload do comprovante:', error);
      return { url: null, error: 'Erro interno no upload' };
    }
  }

  // ===== LOGO UPLOAD =====
  async uploadLogo(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(this.BUCKETS.LOGOS)
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      const { data: urlData } = supabase.storage
        .from(this.BUCKETS.LOGOS)
        .getPublicUrl(fileName);

      return { url: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Erro no upload do logo:', error);
      return { url: null, error: 'Erro interno no upload' };
    }
  }

  // ===== DELETE FILES =====
  async deleteFile(bucket: string, filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      return !error;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      return false;
    }
  }

  // ===== UTILITY METHODS =====
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Arquivo muito grande. Máximo 5MB.' };
    }

    return { valid: true };
  }

  validateDocumentFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou PDF.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Arquivo muito grande. Máximo 10MB.' };
    }

    return { valid: true };
  }
}

export const storageService = new SupabaseStorageService();