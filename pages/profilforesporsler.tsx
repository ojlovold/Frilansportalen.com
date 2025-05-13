// pages/profilforesporsler.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import type { User } from '@supabase/supabase-js'
import supabase from '../lib/supabaseClient'

type Forespørsel = {
  id: string
  fra: string
  status: string
  opprettet: string
}

export default function ProfilForespørsler() {
  const rawUser = useUser()
  const user = rawUser && typeof rawUser === 'object' && 'id' in rawUser ? (rawUser as User) : null
  const [forespørsler, setForespørsler] = useState<Forespørsel[]>([])

  useEffect(() => {
    const hent = async () => {
      if (!user?.id) return
      const { data, error } = await supabase
        .from('profiltilgang')
        .select('*')
        .eq('til', user.id)
        .eq('status', 'venter')
        .order('opprettet', { ascending: false })

      if (!error && data) setForespørsler(data)
    }

    hent()
  }, [user])

  const oppdaterStatus = async (id: string, status: 'godkjent' | 'avslått') => {
    await supabase.from('profiltilgang').update({ status }).eq('id', id)
    setForespørsler((f) => f.filter((r) => r.id !== id))
  }

  return (
    <>
      <Head>
        <title>Profilforespørsler | Frilansportalen</title>
        <meta name="description" content="Behandle forespørsler om tilgang til profilen din" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Forespørsler om profilsynlighet</h1>

        {forespørsler.length === 0 ? (
          <p>Du har ingen nye forespørsler.</p>
        ) : (
          <ul className="space-y-4 max-w-xl">
            {forespørsler.map((f) => (
              <li key={f.id} className="bg-white p-4 rounded shadow">
                <p>
                  Bruker <strong>{f.fra}</strong> har bedt om tilgang til profilen din.
                </p>
                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => oppdaterStatus(f.id, 'godkjent')}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Godkjenn
                  </button>
                  <button
                    onClick={() => oppdaterStatus(f.id, 'avslått')}
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Avslå
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
