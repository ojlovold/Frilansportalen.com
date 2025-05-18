// lib/notifications.ts
import { supabase } from './supabaseClient';

export async function sendNotification(
  userId: string,
  message: string,
  type: string = 'info'
) {
  const { error } = await supabase.from('varsler').insert([
    {
      user_id: userId,
      message,
      type,
      lest: false,
    },
  ]);
  if (error) throw error;
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('varsler')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
