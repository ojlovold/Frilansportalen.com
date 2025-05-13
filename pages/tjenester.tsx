// pages/tjenester.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

type Tjeneste = {
  id: string
  navn: string
  sted: string
  kategori: string
  tilgjengelighet: string
  beskrivelse: string
}

type FilterFelt = 'sted' | 'kategori' | 'tilgjengelighet'

export default function Tjenester() {
  const [tjenester, setTjenester] = useState<Tjeneste[]>([])
  const [filtrert, setFiltrert] = useState<Tjeneste[]>([])
  const [filter, setFilter] = useState<Record<FilterFelt, string>>({
    sted: '',
    kategori: '',
    tilgjengelighet: '',
  })

  useEffect(() => {
    const hentTjenester = async () => {
      const { data, error } = await supabase.from('tjenester').select('*')
      if (!error && data) {
        setTjenester(data)
        setFiltrert(data)
      }
    }

    hentTjenester()
  }, [])

  useEffect(() => {
    const filtrertListe = tjenester.filter((t) => {
      return (
        (filter.sted === '' || t.sted === filter.sted) &&
        (filter.kategori === '' || t.kategori === filter.kategori) &&
        (filter.tilgjengelighet === '' || t.tilgjengelighet === filter.tilgjengelighet)
      )
    })

    setFiltrert(filtrertListe)
  }, [filter, tjenester])

  const unike = (felt: FilterFelt) =>
    Array.from(new Set(tjenester.map((t) => t[felt])))

  return (
    <>
      <Head>
        <title>Tjenester | Frilansportalen</title>
        <meta name="description" content="Finn tilbydere av tjenester i ditt område" />
      </Head>
      <main className="bg-portalGul min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Tjenestetilbydere</h1>

        {/* Filtrering */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(['sted', 'kategori', 'tilgjengelighet'] as FilterFelt[]).map((felt) => (
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
          {filtrert.length === 0 && <p>Ingen tjenester matcher filtrene.</p>}
          {filtrert.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold">{t.navn}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {t.sted} | {t.kategori} | {t.tilgjengelighet}
              </p>
              <p>{t.beskrivelse}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
