// Cloudinary Storage Service - Handle image uploads
interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

class CloudinaryStorageService {
  private readonly CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload`;
  private readonly CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
  private readonly CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

  // ===== AVATAR UPLOAD =====
  async uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // You can create a custom preset
      formData.append('folder', `avatars/${userId}`);
      formData.append('public_id', `avatar`);
      formData.append('overwrite', 'true');

      const response = await fetch(this.CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: CloudinaryResponse = await response.json();
      return { url: data.secure_url, error: null };
    } catch (error) {
      console.error('Erro no upload do avatar:', error);
      return { url: null, error: 'Erro interno no upload' };
    }
  }

  // ===== RECIPE IMAGES =====
  async uploadRecipeImage(userId: string, recipeId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('folder', `receitas/${userId}`);
      formData.append('public_id', recipeId);
      formData.append('overwrite', 'true');

      const response = await fetch(this.CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: CloudinaryResponse = await response.json();
      return { url: data.secure_url, error: null };
    } catch (error) {
      console.error('Erro no upload da imagem da receita:', error);
      return { url: null, error: 'Erro interno no upload' };
    }
  }

  // ===== RECEIPT/DOCUMENT UPLOAD =====
  async uploadReceipt(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      const timestamp = Date.now();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('folder', `comprovantes/${userId}`);
      formData.append('public_id', `receipt_${timestamp}`);

      const response = await fetch(this.CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: CloudinaryResponse = await response.json();
      return { url: data.secure_url, error: null };
    } catch (error) {
      console.error('Erro no upload do comprovante:', error);
      return { url: null, error: 'Erro interno no upload' };
    }
  }

  // ===== LOGO UPLOAD =====
  async uploadLogo(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('folder', `logos/${userId}`);
      formData.append('public_id', 'logo');
      formData.append('overwrite', 'true');

      const response = await fetch(this.CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: CloudinaryResponse = await response.json();
      return { url: data.secure_url, error: null };
    } catch (error) {
      console.error('Erro no upload do logo:', error);
      return { url: null, error: 'Erro interno no upload' };
    }
  }

  // ===== DELETE FILES =====
  async deleteFile(publicId: string): Promise<boolean> {
    try {
      // For deletion, you would need to use the Cloudinary Admin API
      // This would typically be done on the backend
      console.log('Delete file with public_id:', publicId);
      return true;
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

export const storageService = new CloudinaryStorageService();