import supabase from './supabaseClient'

export async function lagreRapport(rapport: any) {
  const { error } = await supabase.from('rapporter').insert([rapport])
  if (error) throw error
}

export async function hentRapporter(userId: string) {
  const { data, error } = await supabase
    .from('rapporter')
    .select('*')
    .eq('bruker_id', userId)
    .order('opprettet', { ascending: false })

  if (error) throw error
  return data
}
