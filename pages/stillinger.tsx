// pages/stillinger.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

type Stilling = {
  id: string
  tittel: string
  sted: string
  type: string
  frist: string
  bransje: string
  beskrivelse: string
}

export default function Stillinger() {
  const [stillinger, setStillinger] = useState<Stilling[]>([])
  const [filtrert, setFiltrert] = useState<Stilling[]>([])
  const [filter, setFilter] = useState({
    sted: '',
    type: '',
    frist: '',
    bransje: '',
  })

  useEffect(() => {
    const hentStillinger = async () => {
      const { data, error } = await supabase.from('stillinger').select('*')
      if (!error && data) {
        setStillinger(data)
        setFiltrert(data)
      }
    }

    hentStillinger()
  }, [])

  useEffect(() => {
    const filtrertListe = stillinger.filter((s) => {
      return (
        (filter.sted === '' || s.sted === filter.sted) &&
        (filter.type === '' || s.type === filter.type) &&
        (filter.frist === '' || s.frist === filter.frist) &&
        (filter.bransje === '' || s.bransje === filter.bransje)
      )
    })

    setFiltrert(filtrertListe)
  }, [filter, stillinger])

  const unike = (felt: keyof Stilling) =>
    Array.from(new Set(stillinger.map((s) => s[felt])))

  return (
    <>
      <Head>
        <title>Stillinger | Frilansportalen</title>
        <meta name="description" content="Søk blant ledige stillinger i Frilansportalen" />
      </Head>
      <main className="bg-portalGul min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Ledige stillinger</h1>

        {/* Filtrering */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {(['sted', 'type', 'frist', 'bransje'] as (keyof Stilling)[]).map((felt) => (
            <select
              key={felt}
              value={filter[felt]}
              onChange={(e) => setFilter({ ...filter, [felt]: e.target.value })}
              className="p-2 rounded border"
            >
              <option value="">{felt[0].toUpperCase() + felt.slice(1)}</option>
              {unike(felt).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* Visning */}
        <div className="grid gap-6">
          {filtrert.length === 0 && <p>Ingen stillinger matcher filtrene.</p>}
          {filtrert.map((s) => (
            <div key={s.id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold">{s.tittel}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {s.sted} | {s.type} | Frist: {s.frist} | {s.bransje}
              </p>
              <p>{s.beskrivelse}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
