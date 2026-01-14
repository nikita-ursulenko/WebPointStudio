// Authentication utilities
// Хеширование паролей и проверка через Supabase

import { supabase } from './supabase';

/**
 * Хеширует пароль используя Web Crypto API (SHA-256)
 * В продакшене лучше использовать bcrypt или Argon2
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Проверяет пароль пользователя через Supabase
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  try {
    // Получаем пользователя из БД
    const { data, error } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('username', username)
      .single();

    if (error || !data) {
      console.error('Error fetching admin user:', error);
      return false;
    }

    // Хешируем введенный пароль
    const passwordHash = await hashPassword(password);

    // Сравниваем хеши
    return passwordHash === data.password_hash;
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return false;
  }
}

/**
 * Создает или обновляет админа в БД
 * Используется для первоначальной настройки
 */
export async function createOrUpdateAdmin(
  username: string,
  password: string
): Promise<boolean> {
  try {
    const passwordHash = await hashPassword(password);

    const { error } = await supabase
      .from('admin_users')
      .upsert(
        {
          username,
          password_hash: passwordHash,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'username',
        }
      );

    if (error) {
      console.error('Error creating/updating admin:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createOrUpdateAdmin:', error);
    return false;
  }
}
