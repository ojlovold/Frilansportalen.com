// pages/admin/visningsanalyse.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import supabase from '../../lib/supabaseClient'

type TopElement = {
  innhold_id: string
  antall: number
  type: string
  tittel?: string
  navn?: string
}

export default function AdminVisningsanalyse() {
  const [topp, setTopp] = useState<TopElement[]>([])

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase
        .from('visningslogg')
        .select('innhold_id, type, count:innhold_id')
        .group('innhold_id, type')
        .order('count', { ascending: false })
        .limit(50)

      if (!error && data) {
        const enriched = await Promise.all(
          data.map(async (entry: any) => {
            const tabell =
              entry.type === 'stilling'
                ? 'stillinger'
                : entry.type === 'tjeneste'
                ? 'tjenester'
                : entry.type === 'gjenbruk'
                ? 'gjenbruk'
                : 'brukerprofiler'

            const { data: detaljer } = await supabase
              .from(tabell)
              .select('tittel, navn')
              .eq('id', entry.innhold_id)
              .maybeSingle()

            return {
              ...entry,
              tittel: detaljer?.tittel || detaljer?.navn || 'Ukjent',
            }
          })
        )

        setTopp(enriched)
      }
    }

    hent()
  }, [])

  return (
    <>
      <Head>
        <title>Visningsanalyse | Frilansportalen Admin</title>
        <meta name="description" content="Se hvilke elementer som vises mest i systemet" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Analyse: mest viste elementer</h1>

        {topp.length === 0 && <p>Ingen data å vise ennå.</p>}

        <div className="grid gap-4">
          {topp.map((e, i) => (
            <div key={i} className="bg-white p-4 rounded shadow text-sm">
              <p className="text-gray-600">{e.type.toUpperCase()}</p>
              <p className="font-semibold">{e.tittel}</p>
              <p className="text-gray-500">Visninger: {e.antall}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
