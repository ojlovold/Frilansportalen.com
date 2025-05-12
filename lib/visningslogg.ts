// pages/visningslogg.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'

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

export default function Visningslogg() {
  const user = useUser()
  const [logg, setLogg] = useState<(Logg & { data?: Detalj | null })[]>([])

  useEffect(() => {
    const hent = async () => {
      if (!user || !user.id) return

      const { data: base } = await supabase
        .from('visningslogg')
        .select('*')
        .eq('bruker_id', user.id)
        .order('tidspunkt', { ascending: false })
        .limit(100)

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

          const { data } = await supabase
            .from(tabell)
            .select('*')
            .eq('id', post.innhold_id)
            .maybeSingle()

          return { ...post, data }
        })
      )

      setLogg(beriket)
    }

    hent()
  }, [user])

  return (
    <>
      <Head>
        <title>Visningslogg | Frilansportalen</title>
        <meta name="description" content="Se hva du har åpnet tidligere" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Nylig vist</h1>

        <div className="grid gap-4 max-w-3xl">
          {logg.length === 0 && <p>Du har ikke vist noen elementer ennå.</p>}
          {logg.map((l) => (
            <div key={l.id} className="bg-white p-4 rounded shadow text-sm">
              <p className="text-gray-600">
                {new Date(l.tidspunkt).toLocaleString('no-NO')} – {l.type}
              </p>
              <p className="font-semibold">
                {l.data?.tittel || l.data?.navn || 'Ukjent'}
              </p>
              {l.data?.sted && <p className="text-gray-600">{l.data.sted}</p>}
              {l.data?.kategori && (
                <p className="text-gray-600">Kategori: {l.data.kategori}</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
