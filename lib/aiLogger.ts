// lib/aiLogger.ts
import supabase from './supabaseClient'

export async function loggAIForslag(
  bruker_id: string,
  modul: string,
  forslag: string,
  akseptert: boolean
) {
  if (!bruker_id || !modul || !forslag) return

  await supabase.from('ai_logger').insert([
    {
      bruker_id,
      modul,
      forslag,
      akseptert,
    },
  ])
}
