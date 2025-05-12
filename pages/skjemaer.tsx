// pages/skjemaer.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

type Skjema = {
  id: string
  tittel: string
  kategori: string
  fil_url: string
}

export default function Skjemabank() {
  const [skjemaer, setSkjemaer] = useState<Skjema[]>([])
  const [filter, setFilter] = useState('')
  const [filtrert, setFiltrert] = useState<Skjema[]>([])

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase.from('skjemaer').select('*')
      if (!error && data) {
        setSkjemaer(data)
        setFiltrert(data)
      }
    }

    hent()
  }, [])

  useEffect(() => {
    if (!filter) setFiltrert(skjemaer)
    else setFiltrert(skjemaer.filter((s) => s.kategori === filter))
  }, [filter, skjemaer])

  const unikeKategorier = Array.from(new Set(skjemaer.map((s) => s.kategori)))

  return (
    <>
      <Head>
        <title>Skjemabank | Frilansportalen</title>
        <meta name="description" content="Last ned relevante skjemaer og maler" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Skjemabank</h1>

        <div className="mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Alle kategorier</option>
            {unikeKategorier.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4">
          {filtrert.length === 0 && <p>Ingen skjemaer funnet.</p>}
          {filtrert.map((s) => (
            <div key={s.id} className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold text-lg">{s.tittel}</h2>
              <p className="text-sm text-gray-600 mb-2">{s.kategori}</p>
              <a
                href={s.fil_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Last ned
              </a>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
