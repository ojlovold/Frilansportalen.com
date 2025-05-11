// lib/bruker.ts
import supabase from './supabaseClient'

export async function hentBrukerProfil(userId: string) {
  const { data, error } = await supabase
    .from('brukerprofiler')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function oppdaterBrukerProfil(userId: string, oppdatering: any) {
  const { error } = await supabase
    .from('brukerprofiler')
    .update(oppdatering)
    .eq('id', userId)

  if (error) throw error
}
