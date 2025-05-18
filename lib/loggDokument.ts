// lib/loggDokument.ts
import { supabase } from './supabaseClient';

export async function loggDokumentHendelse(
  bruker_id: string,
  filnavn: string,
  bucket: string,
  handling: 'opplasting' | 'nedlasting' | 'sletting'
) {
  if (!bruker_id || !filnavn || !bucket || !handling) return;

  await supabase.from('dokumentlogg').insert([
    {
      bruker_id,
      filnavn,
      bucket,
      handling,
    },
  ]);
}
