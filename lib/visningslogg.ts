import { useUser } from '@supabase/auth-helpers-react'
import type { User } from '@supabase/supabase-js'
import supabase from './supabaseClient'

type Logg = {
  id: string
  type: string
  innhold_id: string
  tidspunkt: string
}

type Detalj = {
  id: string
  tittel?: string
  navn?: string
  kategori?: string
  sted?: string
}

export async function hentVisningslogg(user: User | null): Promise<(Logg & { data?: Detalj | null })[]> {
  if (!user?.id) return []

  const { data: base, error } = await supabase
    .from('visningslogg')
    .select('*')
    .eq('bruker_id', user.id)
    .order('tidspunkt', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Feil ved henting av visningslogg:', error.message)
    return []
  }

  const beriket = await Promise.all(
    (base || []).map(async (post) => {
      const tabell =
        post.type === 'stilling'
          ? 'stillinger'
          : post.type === 'tjeneste'
          ? 'tjenester'
          : post.type === 'gjenbruk'
          ? 'gjenbruk'
          : 'brukerprofiler'

      const { data: detalj } = await supabase
        .from(tabell)
        .select('*')
        .eq('id', post.innhold_id)
        .maybeSingle()

      return { ...post, data: detalj || null }
    })
  )

  return beriket
}
