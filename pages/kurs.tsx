// pages/kurs.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

type Kurs = {
  id: string
  tittel: string
  tilbyder: string
  kategori: string
  sted: string
  tidspunkt: string
  pris: number
  beskrivelse: string
}

export default function Kursportal() {
  const [kurs, setKurs] = useState<Kurs[]>([])
  const [filtrert, setFiltrert] = useState<Kurs[]>([])
  const [filter, setFilter] = useState({
    kategori: '',
    sted: '',
  })

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase.from('kurs').select('*')
      if (!error && data) {
        setKurs(data)
        setFiltrert(data)
      }
    }

    hent()
  }, [])

  useEffect(() => {
    const resultat = kurs.filter((k) => {
      return (
        (filter.kategori === '' || k.kategori === filter.kategori) &&
        (filter.sted === '' || k.sted === filter.sted)
      )
    })
    setFiltrert(resultat)
  }, [filter, kurs])

  const unike = (felt: keyof Kurs) =>
    Array.from(new Set(kurs.map((k) => k[felt])))

  return (
    <>
      <Head>
        <title>Kursportal | Frilansportalen</title>
        <meta name="description" content="Finn kurs og opplæringstilbud i din bransje" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Kursportal</h1>

        {/* Filtrering */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {(['kategori', 'sted'] as (keyof Kurs)[]).map((felt) => (
            <select
              key={felt}
              value={filter[felt]}
              onChange={(e) =>
                setFilter({ ...filter, [felt]: e.target.value })
              }
              className="p-2 border rounded"
            >
              <option value="">Velg {felt}</option>
              {unike(felt).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* Kursvisning */}
        <div className="grid gap-6">
          {filtrert.length === 0 && <p>Ingen kurs funnet.</p>}
          {filtrert.map((k) => (
            <div key={k.id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold">{k.tittel}</h2>
              <p className="text-sm text-gray-600 mb-1">
                {k.tilbyder} | {k.kategori} | {k.sted}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Tidspunkt: {k.tidspunkt} | Pris: {k.pris === 0 ? 'Gratis' : `${k.pris} kr`}
              </p>
              <p>{k.beskrivelse}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
