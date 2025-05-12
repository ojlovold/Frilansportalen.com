// pages/tjenesteovervaking.tsx
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'

type Overvaking = {
  id: string
  sted?: string
  kategori?: string
}

export default function Tjenesteovervaking() {
  const user = useUser()
  const [liste, setListe] = useState<Overvaking[]>([])
  const [ny, setNy] = useState({
    sted: '',
    kategori: '',
  })

  const hent = async () => {
    if (!user?.id) return
    const { data } = await supabase
      .from('tjenesteovervaking')
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
    await supabase.from('tjenesteovervaking').insert([
      {
        ...ny,
        bruker_id: user.id,
      },
    ])
    setNy({ sted: '', kategori: '' })
    hent()
  }

  const slett = async (id: string) => {
    await supabase.from('tjenesteovervaking').delete().eq('id', id)
    hent()
  }

  return (
    <>
      <Head>
        <title>Tjenesteovervåking | Frilansportalen</title>
        <meta name="description" content="Få varsel når nye tjenester legges ut" />
      </Head>
      <main className="min-h-screen bg-portalGul p-8 text-black max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mine tjenestevarslere</h1>

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
            placeholder="Kategori (f.eks. renhold)"
            value={ny.kategori}
            onChange={(e) => setNy({ ...ny, kategori: e.target.value })}
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
          {liste.length === 0 && <p>Ingen aktive varslinger.</p>}
          {liste.map((o) => (
            <div key={o.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div className="text-sm">
                <p>Sted: {o.sted || 'alle'}</p>
                <p>Kategori: {o.kategori || 'alle'}</p>
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
