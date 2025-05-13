// pages/stillingsovervaking.tsx
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

type Overvaking = {
  id: string
  sted?: string
  bransje?: string
  type?: string
}

export default function Stillingsovervaking() {
  const rawUser = useUser()
  const user = rawUser as unknown as User | null

  const [liste, setListe] = useState<Overvaking[]>([])
  const [ny, setNy] = useState({
    sted: '',
    bransje: '',
    type: '',
  })

  const hent = async () => {
    if (!user?.id) return
    const { data } = await supabase
      .from('stillingsovervaking')
      .select('*')
      .eq('bruker_id', user.id)
      .order('opprettet', { ascending: false })
    if (data) setListe(data)
  }

  useEffect(() => {
    hent()
  }, [user])

  const lagre = async () => {
    if (!user?.id) return
    await supabase.from('stillingsovervaking').insert([
      {
        ...ny,
        bruker_id: user.id,
      },
    ])
    setNy({ sted: '', bransje: '', type: '' })
    hent()
  }

  const slett = async (id: string) => {
    await supabase.from('stillingsovervaking').delete().eq('id', id)
    hent()
  }

  return (
    <>
      <Head>
        <title>Stillingsovervåking | Frilansportalen</title>
        <meta name="description" content="Opprett jobbagenter og få varsel ved nye stillinger" />
      </Head>
      <main className="min-h-screen bg-portalGul p-8 text-black max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mine overvåkninger</h1>

        <div className="bg-white p-4 rounded shadow mb-8">
          <h2 className="text-lg font-semibold mb-2">Ny overvåkning</h2>
          <input
            type="text"
            placeholder="Sted"
            value={ny.sted}
            onChange={(e) => setNy({ ...ny, sted: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Bransje"
            value={ny.bransje}
            onChange={(e) => setNy({ ...ny, bransje: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Type (f.eks. deltidsjobb)"
            value={ny.type}
            onChange={(e) => setNy({ ...ny, type: e.target.value })}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={lagre}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Lagre overvåkning
          </button>
        </div>

        <div className="space-y-4">
          {liste.length === 0 && <p>Ingen aktive overvåkninger.</p>}
          {liste.map((o) => (
            <div key={o.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div className="text-sm">
                <p>Sted: {o.sted || 'alle'}</p>
                <p>Bransje: {o.bransje || 'alle'}</p>
                <p>Type: {o.type || 'alle'}</p>
              </div>
              <button
                onClick={() => slett(o.id)}
                className="text-red-600 text-sm"
              >
                Slett
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
