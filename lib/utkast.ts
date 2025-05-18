// lib/utkast.ts
import { supabase } from './supabaseClient';

export async function lagreUtkast(
  bruker_id: string,
  mottaker_id: string,
  modul: string,
  innhold: string
) {
  if (!bruker_id || !modul) return;

  const { data } = await supabase
    .from('svarutkast')
    .select('id')
    .eq('bruker_id', bruker_id)
    .eq('mottaker_id', mottaker_id)
    .eq('modul', modul)
    .maybeSingle();

  if (data) {
    await supabase
      .from('svarutkast')
      .update({ innhold, sist_lagret: new Date().toISOString() })
      .eq('id', data.id);
  } else {
    await supabase.from('svarutkast').insert([
      {
        bruker_id,
        mottaker_id,
        modul,
        innhold,
      },
    ]);
  }
}

export async function hentUtkast(
  bruker_id: string,
  mottaker_id: string,
  modul: string
) {
  const { data } = await supabase
    .from('svarutkast')
    .select('*')
    .eq('bruker_id', bruker_id)
    .eq('mottaker_id', mottaker_id)
    .eq('modul', modul)
    .maybeSingle();

  return data?.innhold || '';
}

export async function slettUtkast(
  bruker_id: string,
  mottaker_id: string,
  modul: string
) {
  await supabase
    .from('svarutkast')
    .delete()
    .eq('bruker_id', bruker_id)
    .eq('mottaker_id', mottaker_id)
    .eq('modul', modul);
}
