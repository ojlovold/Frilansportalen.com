// pages/personvern.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'

export default function Personvern() {
  const user = useUser()
  const [innstillinger, setInnstillinger] = useState({
    samtykke_ai: true,
    samtykke_varsler: true,
    samtykke_match: true,
  })
  const [status, setStatus] = useState<'klar' | 'lagret' | 'feil'>('klar')

  useEffect(() => {
    const hent = async () => {
      if (!user || !user.id) return
      const { data } = await supabase
        .from('brukerprofiler')
        .select('samtykke_ai, samtykke_varsler, samtykke_match')
        .eq('id', user.id)
        .single()
      if (data) setInnstillinger(data)
    }

    hent()
  }, [user])

  const lagre = async () => {
    if (!user || !user.id) return
    const { error } = await supabase
      .from('brukerprofiler')
      .update(innstillinger)
      .eq('id', user.id)

    setStatus(error ? 'feil' : 'lagret')
  }

  return (
    <>
      <Head>
        <title>Personvern | Frilansportalen</title>
        <meta name="description" content="Behandle dine personverninnstillinger og samtykker" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Personvern og samtykke</h1>

        <form className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={innstillinger.samtykke_ai}
              onChange={(e) => setInnstillinger({ ...innstillinger, samtykke_ai: e.target.checked })}
            />
            Tillat at AI bruker svar og mønster til forbedring
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={innstillinger.samtykke_varsler}
              onChange={(e) => setInnstillinger({ ...innstillinger, samtykke_varsler: e.target.checked })}
            />
            Tillat varsler i app og på e-post
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={innstillinger.samtykke_match}
              onChange={(e) => setInnstillinger({ ...innstillinger, samtykke_match: e.target.checked })}
            />
            Tillat at profilen vises i automatiske forslag
          </label>

          <button
            type="button"
            onClick={lagre}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Lagre innstillinger
          </button>

          {status === 'lagret' && <p className="text-green-600">Endringer lagret!</p>}
          {status === 'feil' && <p className="text-red-600">Noe gikk galt.</p>}
        </form>
      </main>
    </>
  )
}
