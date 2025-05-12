// pages/firma.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'

type Firmadok = {
  id: string
  tittel: string
  kategori: string
  fil_url: string
  firma_id: string
  kun_for: string[] | null
}

export default function FirmaBibliotek() {
  const user = useUser()
  const [firmaId, setFirmaId] = useState('') // Dette hentes normalt fra profilen
  const [dokumenter, setDokumenter] = useState<Firmadok[]>([])

  useEffect(() => {
    const hent = async () => {
      if (!user || !user.id || !firmaId) return

      const { data, error } = await supabase
        .from('firmadokumenter')
        .select('*')
        .eq('firma_id', firmaId)

      if (!error && data) {
        const synlige = data.filter(
          (d) =>
            !d.kun_for ||
            d.kun_for.length === 0 ||
            d.kun_for.includes(user.id)
        )
        setDokumenter(synlige)
      }
    }

    hent()
  }, [user, firmaId])

  return (
    <>
      <Head>
        <title>Firmabibliotek | Frilansportalen</title>
        <meta name="description" content="Se delte dokumenter fra din arbeidsgiver" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Firmabibliotek</h1>

        <div className="max-w-lg mb-6">
          <input
            type="text"
            placeholder="Firma-ID (orgnr)"
            value={firmaId}
            onChange={(e) => setFirmaId(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="grid gap-4">
          {dokumenter.length === 0 && <p>Ingen dokumenter funnet eller tilgjengelige.</p>}
          {dokumenter.map((d) => (
            <div key={d.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{d.tittel}</h2>
              <p className="text-sm text-gray-600 mb-2">{d.kategori}</p>
              <a
                href={d.fil_url}
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
