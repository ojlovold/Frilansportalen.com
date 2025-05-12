// pages/sokehistorikk.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'

type Soek = {
  id: string
  soek: string
  modul: string
  tidspunkt: string
}

export default function Sokehistorikk() {
  const user = useUser()
  const [historikk, setHistorikk] = useState<Soek[]>([])

  useEffect(() => {
    const hent = async () => {
      if (!user || !user.id) return
      const { data, error } = await supabase
        .from('sokelogg')
        .select('*')
        .eq('bruker_id', user.id)
        .order('tidspunkt', { ascending: false })
        .limit(100)

      if (!error && data) setHistorikk(data)
    }

    hent()
  }, [user])

  return (
    <>
      <Head>
        <title>Søkehistorikk | Frilansportalen</title>
        <meta name="description" content="Se dine tidligere søk" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Søkehistorikk</h1>

        <div className="max-w-2xl space-y-4">
          {historikk.length === 0 && <p>Du har ingen søkehistorikk ennå.</p>}
          {historikk.map((s) => (
            <div key={s.id} className="bg-white p-4 rounded shadow">
              <p className="text-sm">
                <strong>{s.soek}</strong> i <em>{s.modul}</em>
              </p>
              <p className="text-xs text-gray-600">
                {new Date(s.tidspunkt).toLocaleString('no-NO')}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
