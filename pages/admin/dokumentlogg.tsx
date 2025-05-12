// pages/admin/dokumentlogg.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import supabase from '../../lib/supabaseClient'

type Loggpost = {
  id: string
  bruker_id: string
  filnavn: string
  bucket: string
  tidspunkt: string
  handling: string
}

export default function AdminDokumentlogg() {
  const [logg, setLogg] = useState<Loggpost[]>([])

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase
        .from('dokumentlogg')
        .select('*')
        .order('tidspunkt', { ascending: false })
        .limit(100)

      if (!error && data) setLogg(data)
    }

    hent()
  }, [])

  return (
    <>
      <Head>
        <title>Admin – Dokumentlogg | Frilansportalen</title>
        <meta name="description" content="Se aktivitet på filer i systemet" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Dokumentlogg</h1>

        <div className="grid gap-4 max-w-4xl">
          {logg.length === 0 && <p>Ingen aktivitet loggført.</p>}
          {logg.map((l) => (
            <div key={l.id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold text-sm">{l.handling.toUpperCase()}</p>
              <p className="text-sm text-gray-600 mb-1">
                Fil: {l.filnavn} | Bucket: {l.bucket}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Bruker-ID: {l.bruker_id}
              </p>
              <p className="text-sm text-gray-500">
                Tidspunkt: {new Date(l.tidspunkt).toLocaleString('no-NO')}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
