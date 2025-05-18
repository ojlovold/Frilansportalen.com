import { supabase } from './supabaseClient';

export async function sendFaktura(faktura: any) {
  const { error } = await supabase.from('fakturaer').insert([faktura]);
  if (error) throw error;
}

export async function hentFakturaer(userId: string) {
  const { data, error } = await supabase
    .from('fakturaer')
    .select('*')
    .eq('frilanser_id', userId)
    .order('opprettet', { ascending: false });

  if (error) throw error;
  return data;
}
