import Head from 'next/head'
import { useEffect, useState } from 'react'
import supabase from '../../lib/supabaseClient'

type VisningStat = {
  innhold_id: string
  antall: number
  type: string
  tittel?: string
}

const MAKS_ELEMENTER = 50

const visningsTypeNavn = (type: string) => {
  switch (type) {
    case 'stilling': return 'Stilling'
    case 'tjeneste': return 'Tjeneste'
    case 'gjenbruk': return 'Gjenbruk'
    case 'profil':
    case 'brukerprofiler': return 'Brukerprofil'
    default: return type
  }
}

export default function VisningsAnalyse() {
  const [data, setData] = useState<VisningStat[]>([])
  const [laster, setLaster] = useState(true)

  useEffect(() => {
    const hent = async () => {
      setLaster(true)

      const { data: logg, error } = await supabase
        .from('visningslogg')
        .select('innhold_id, type')

      if (error || !logg) {
        console.error('Feil ved henting av visningslogg:', error?.message)
        setLaster(false)
        return
      }

      const grupper: Record<string, { innhold_id: string; type: string; antall: number }> = {}

      for (const post of logg) {
        const key = `${post.innhold_id}:${post.type}`
        if (!grupper[key]) {
          grupper[key] = { innhold_id: post.innhold_id, type: post.type, antall: 0 }
        }
        grupper[key].antall++
      }

      const topp = Object.values(grupper)
        .sort((a, b) => b.antall - a.antall)
        .slice(0, MAKS_ELEMENTER)

      const medDetaljer = await Promise.all(
        topp.map(async (item) => {
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
            .eq('id', item.innhold_id)
            .maybeSingle()

          return {
            ...item,
            tittel: d?.tittel || d?.navn || 'Ukjent',
          }
        })
      )

      setData(medDetaljer)
      setLaster(false)
    }

    hent()
  }, [])

  return (
    <>
      <Head>
        <title>Visningsanalyse | Frilansportalen Admin</title>
        <meta name="description" content="Se hvilke elementer som er vist flest ganger" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mest viste elementer</h1>

        {laster ? (
          <p>Laster analyse...</p>
        ) : data.length === 0 ? (
          <p>Ingen data å vise.</p>
        ) : (
          <div className="grid gap-4">
            {data.map((e) => (
              <div key={e.innhold_id} className="bg-white p-4 rounded shadow text-sm">
                <p className="text-gray-600">{visningsTypeNavn(e.type)}</p>
                <p className="font-semibold">{e.tittel}</p>
                <p className="text-gray-500">Vist: {e.antall} ganger</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
