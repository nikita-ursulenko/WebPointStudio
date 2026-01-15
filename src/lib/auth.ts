// Authentication utilities
// Uses Supabase Native Auth instead of insecure custom hashing

import { supabase } from './supabase';

/**
 * Вход в систему с помощью Supabase Auth
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error.message);
    return { user: null, error };
  }

  return { user: data.user, error: null };
}

/**
 * Выход из системы
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  }
}

/**
 * Получение текущего пользователя
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
