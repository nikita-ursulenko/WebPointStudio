// Storage utilities for file uploads using Cloudinary
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'webpoint_images';
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

/**
 * Загружает изображение для статьи блога в Cloudinary
 * @param file - файл изображения
 * @param articleId - ID статьи (для организации файлов)
 * @returns URL загруженного изображения (public_id или secure_url)
 */
export async function uploadBlogImage(
  file: File,
  articleId: number | null
): Promise<string> {
  try {
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not set in environment variables');
    }

    // Создаем FormData для загрузки
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Preset настроен на автоматическую генерацию public_id,
    // поэтому не задаем folder и public_id вручную
    
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Возвращаем secure_url для хранения в БД (полный URL)
    // Preset генерирует public_id автоматически, поэтому используем secure_url
    return data.secure_url || data.public_id;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}

/**
 * Удаляет изображение статьи из Cloudinary
 * @param imagePath - public_id изображения (например, blog/1/image) или URL
 */
export async function deleteBlogImage(imagePath: string): Promise<void> {
  try {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY) {
      console.warn('Cloudinary credentials not configured for deletion');
      return;
    }

    // Извлекаем public_id из URL, если передан URL
    let publicId = imagePath;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      // Извлекаем public_id из Cloudinary URL
      const urlMatch = imagePath.match(/\/v\d+\/(.+?)(?:\.[^.]+)?$/);
      if (urlMatch) {
        publicId = urlMatch[1];
      } else {
        console.warn('Could not extract public_id from URL:', imagePath);
        return;
      }
    }

    // Для удаления нужен API secret, который не должен быть на клиенте
    // Поэтому удаление через клиент не рекомендуется
    // Это должно выполняться на сервере
    console.warn('Image deletion should be performed server-side for security');
  } catch (error) {
    console.error('Error in deleteBlogImage:', error);
  }
}

/**
 * Получает URL изображения из Cloudinary
 * @param imagePath - public_id изображения (например, blog/1/image) или URL
 * @returns публичный URL изображения
 */
export function getBlogImageUrl(imagePath: string): string {
  // Если это уже полный URL, возвращаем как есть
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Если это public_id, формируем URL Cloudinary
  if (CLOUDINARY_CLOUD_NAME) {
    // Используем автоматическую оптимизацию (f_auto для формата, q_auto для качества)
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${imagePath}`;
  }

  // Если cloud name не настроен, возвращаем как есть
  return imagePath;
}
