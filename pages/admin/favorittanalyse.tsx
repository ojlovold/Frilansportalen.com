// pages/admin/favorittanalyse.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import supabase from '../../lib/supabaseClient'

type FavorittStat = {
  objekt_id: string
  antall: number
  type: string
  tittel?: string
  navn?: string
}

export default function FavorittAnalyse() {
  const [data, setData] = useState<FavorittStat[]>([])

  useEffect(() => {
    const hent = async () => {
      const { data: grupper, error } = await supabase
        .from('favoritter')
        .select('objekt_id, type, count:objekt_id')
        .group('objekt_id, type')
        .order('count', { ascending: false })
        .limit(50)

      if (!error && grupper) {
        const detaljer = await Promise.all(
          grupper.map(async (item: any) => {
            const tabell =
              item.type === 'stilling'
                ? 'stillinger'
                : item.type === 'tjeneste'
                ? 'tjenester'
                : item.type === 'gjenbruk'
                ? 'gjenbruk'
                : 'brukerprofiler'

            const { data: d } = await supabase
              .from(tabell)
              .select('tittel, navn')
              .eq('id', item.objekt_id)
              .maybeSingle()

            return {
              ...item,
              tittel: d?.tittel || d?.navn || 'Ukjent',
            }
          })
        )

        setData(detaljer)
      }
    }

    hent()
  }, [])

  return (
    <>
      <Head>
        <title>Favorittanalyse | Frilansportalen Admin</title>
        <meta name="description" content="Se hvilke elementer som er lagret flest ganger" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mest lagrede elementer</h1>

        {data.length === 0 && <p>Ingen data å vise ennå.</p>}

        <div className="grid gap-4">
          {data.map((e, i) => (
            <div key={i} className="bg-white p-4 rounded shadow text-sm">
              <p className="text-gray-600">{e.type.toUpperCase()}</p>
              <p className="font-semibold">{e.tittel}</p>
              <p className="text-gray-500">Lagret: {e.antall} ganger</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
