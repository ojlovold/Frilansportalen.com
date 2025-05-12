// pages/brukere.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

type Brukerprofil = {
  id: string
  navn: string
  rolle: string
  sted?: string
  pris?: number
  synlighet: string
  beskrivelse?: string
}

export default function Brukersøk() {
  const [brukere, setBrukere] = useState<Brukerprofil[]>([])
  const [filtrert, setFiltrert] = useState<Brukerprofil[]>([])
  const [filter, setFilter] = useState({
    rolle: '',
    sted: '',
    maksPris: '',
  })

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase.from('brukerprofiler').select('*')
      if (!error && data) {
        // Filtrer: frilansere = alltid synlig, andre må ha synlighet = 'alle'
        const synlige = data.filter((b: Brukerprofil) =>
          b.rolle === 'frilanser' || b.synlighet === 'alle'
        )
        setBrukere(synlige)
        setFiltrert(synlige)
      }
    }

    hent()
  }, [])

  useEffect(() => {
    const resultat = brukere.filter((b) => {
      return (
        (filter.rolle === '' || b.rolle === filter.rolle) &&
        (filter.sted === '' || b.sted === filter.sted) &&
        (filter.maksPris === '' || (b.pris ?? 0) <= Number(filter.maksPris))
      )
    })
    setFiltrert(resultat)
  }, [filter, brukere])

  const unike = (felt: keyof Brukerprofil) =>
    Array.from(new Set(brukere.map((b) => b[felt]))).filter(Boolean)

  return (
    <>
      <Head>
        <title>Finn brukere | Frilansportalen</title>
        <meta name="description" content="Søk etter frilansere og arbeidssøkere" />
      </Head>
      <main className="bg-portalGul min-h-screen text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Søk etter brukere</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <select
            value={filter.rolle}
            onChange={(e) => setFilter({ ...filter, rolle: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Alle roller</option>
            {unike('rolle').map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={filter.sted}
            onChange={(e) => setFilter({ ...filter, sted: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Alle steder</option>
            {unike('sted').map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Makspris (kr/time)"
            value={filter.maksPris}
            onChange={(e) => setFilter({ ...filter, maksPris: e.target.value })}
            className="p-2 border rounded"
          />
        </div>

        <div className="grid gap-6">
          {filtrert.length === 0 && <p>Ingen profiler matcher filtrene.</p>}
          {filtrert.map((b) => (
            <div key={b.id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold">{b.navn}</h2>
              <p className="text-sm text-gray-600 mb-1">
                {b.rolle} | {b.sted || 'Ukjent'} | {b.pris ? `${b.pris} kr/time` : 'Pris ikke oppgitt'}
              </p>
              {b.beskrivelse && <p className="text-sm">{b.beskrivelse.slice(0, 140)}...</p>}
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
