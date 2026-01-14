/**
 * Получает базовый URL сайта автоматически из текущего location
 */
export const getSiteUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};
