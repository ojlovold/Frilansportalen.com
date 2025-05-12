// pages/admin/gjenbruk.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import supabase from '../../lib/supabaseClient'

type Gjenbruksobjekt = {
  id: string
  tittel: string
  sted: string
  kategori: string
  beskrivelse: string
  pris: number
  aktiv: boolean
  opprettet: string
}

export default function AdminGjenbruk() {
  const [ny, setNy] = useState({
    tittel: '',
    sted: '',
    kategori: '',
    beskrivelse: '',
    pris: 0,
  })
  const [status, setStatus] = useState<'klar' | 'lagret' | 'feil'>('klar')
  const [oppføringer, setOppføringer] = useState<Gjenbruksobjekt[]>([])

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase
        .from('gjenbruk')
        .select('*')
        .order('opprettet', { ascending: false })

      if (!error && data) setOppføringer(data)
    }

    hent()
  }, [status])

  const publiser = async () => {
    const { error } = await supabase.from('gjenbruk').insert([
      {
        ...ny,
        aktiv: true,
        opprettet: new Date().toISOString(),
      },
    ])
    if (error) setStatus('feil')
    else {
      setNy({ tittel: '', sted: '', kategori: '', beskrivelse: '', pris: 0 })
      setStatus('lagret')
    }
  }

  const toggleAktiv = async (id: string, aktiv: boolean) => {
    await supabase.from('gjenbruk').update({ aktiv: !aktiv }).eq('id', id)
    setStatus('klar') // Trigg refresh
  }

  const slett = async (id: string) => {
    await supabase.from('gjenbruk').delete().eq('id', id)
    setStatus('klar')
  }

  return (
    <>
      <Head>
        <title>Admin – Gjenbruk | Frilansportalen</title>
        <meta name="description" content="Administrer gjenbruksoppføringer" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Gjenbruksportal – Admin</h1>

        {/* Ny oppføring */}
        <div className="bg-white p-6 rounded-xl shadow max-w-xl mb-10">
          <h2 className="text-xl font-semibold mb-4">Legg til ny oppføring</h2>
          {['tittel', 'sted', 'kategori', 'beskrivelse'].map((felt) => (
            <input
              key={felt}
              type="text"
              placeholder={felt[0].toUpperCase() + felt.slice(1)}
              value={(ny as any)[felt]}
              onChange={(e) => setNy({ ...ny, [felt]: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />
          ))}
          <input
            type="number"
            placeholder="Pris (0 = gratis)"
            value={ny.pris}
            onChange={(e) => setNy({ ...ny, pris: Number(e.target.value) })}
            className="w-full p-2 border rounded mb-4"
          />
          <button onClick={publiser} className="bg-black text-white px-4 py-2 rounded">
            Publiser
          </button>
          {status === 'lagret' && <p className="text-green-600 mt-2">Oppføring publisert!</p>}
          {status === 'feil' && <p className="text-red-600 mt-2">Noe gikk galt.</p>}
        </div>

        {/* Eksisterende oppføringer */}
        <div className="grid gap-4">
          {oppføringer.map((obj) => (
            <div key={obj.id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="font-semibold text-lg">{obj.tittel}</h3>
                <p className="text-sm text-gray-600">
                  {obj.kategori} | {obj.sted} | {obj.pris === 0 ? 'Gratis' : `${obj.pris} kr`}
                </p>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <button
                  onClick={() => toggleAktiv(obj.id, obj.aktiv)}
                  className={`px-3 py-1 rounded ${
                    obj.aktiv ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'
                  }`}
                >
                  {obj.aktiv ? 'Skjul' : 'Gjør synlig'}
                </button>
                <button
                  onClick={() => slett(obj.id)}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
