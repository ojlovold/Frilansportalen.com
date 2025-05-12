// pages/admin/signaturer.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import supabase from '../../lib/supabaseClient'

type Rad = {
  id: string
  dokument_id: string
  bruker_id: string
  signatur: string
  tidspunkt: string
}

export default function AdminSignaturer() {
  const [signaturer, setSignaturer] = useState<Rad[]>([])

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase
        .from('signaturer')
        .select('*')
        .order('tidspunkt', { ascending: false })
        .limit(100)

      if (!error && data) setSignaturer(data)
    }

    hent()
  }, [])

  return (
    <>
      <Head>
        <title>Signaturer | Admin | Frilansportalen</title>
        <meta name="description" content="Se hvem som har signert dokumenter" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Signerte dokumenter</h1>

        {signaturer.length === 0 ? (
          <p>Ingen signaturer registrert ennå.</p>
        ) : (
          <div className="grid gap-4">
            {signaturer.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded shadow text-sm">
                <p><strong>Dokument:</strong> {s.dokument_id}</p>
                <p><strong>Bruker-ID:</strong> {s.bruker_id}</p>
                <p><strong>Signatur:</strong> {s.signatur}</p>
                <p className="text-gray-500">
                  Tidspunkt: {new Date(s.tidspunkt).toLocaleString('no-NO')}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
