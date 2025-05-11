import supabase from './supabaseClient'

export async function lagreAnbud(anbud: any) {
  const { error } = await supabase.from('anbud').insert([anbud])
  if (error) throw error
}

export async function hentAnbudForBruker(userId: string) {
  const { data, error } = await supabase
    .from('anbud')
    .select('*')
    .eq('bruker_id', userId)

  if (error) throw error
  return data
}
