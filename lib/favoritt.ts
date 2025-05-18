// lib/favoritt.ts
import { supabase } from './supabaseClient';

export async function lagreFavoritt(
  bruker_id: string,
  type: string,
  objekt_id: string
) {
  const { error } = await supabase.from('favoritter').insert([
    { bruker_id, type, objekt_id },
  ]);
  return error ? false : true;
}

export async function fjernFavoritt(
  bruker_id: string,
  type: string,
  objekt_id: string
) {
  const { error } = await supabase
    .from('favoritter')
    .delete()
    .eq('bruker_id', bruker_id)
    .eq('type', type)
    .eq('objekt_id', objekt_id);

  return error ? false : true;
}

export async function erFavoritt(
  bruker_id: string,
  type: string,
  objekt_id: string
) {
  const { data, error } = await supabase
    .from('favoritter')
    .select('*')
    .eq('bruker_id', bruker_id)
    .eq('type', type)
    .eq('objekt_id', objekt_id)
    .maybeSingle();

  return !!data && !error;
}

export async function hentFavoritter(
  bruker_id: string,
  type: string
) {
  const { data, error } = await supabase
    .from('favoritter')
    .select('*')
    .eq('bruker_id', bruker_id)
    .eq('type', type);

  return error ? [] : data;
}
