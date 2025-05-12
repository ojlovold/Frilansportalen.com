// lib/sokelogg.ts
import supabase from './supabaseClient'

export async function loggSoek(
  bruker_id: string,
  soek: string,
  modul: string
) {
  if (!bruker_id || !soek || !modul) return

  await supabase.from('sokelogg').insert([
    {
      bruker_id,
      soek,
      modul,
    },
  ])
}
