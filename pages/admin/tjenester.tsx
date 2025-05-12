// pages/admin/tjenester.tsx
import Head from 'next/head'
import { useState } from 'react'
import supabase from '../../lib/supabaseClient'

export default function AdminTjenester() {
  const [tjeneste, setTjeneste] = useState({
    navn: '',
    sted: '',
    kategori: '',
    tilgjengelighet: '',
    beskrivelse: '',
  })
  const [status, setStatus] = useState<'klar' | 'lagrer' | 'lagret' | 'feil'>('klar')

  const opprettTjeneste = async () => {
    setStatus('lagrer')
    const { error } = await supabase.from('tjenester').insert([tjeneste])
    if (error) {
      setStatus('feil')
    } else {
      setStatus('lagret')
      setTjeneste({
        navn: '',
        sted: '',
        kategori: '',
        tilgjengelighet: '',
        beskrivelse: '',
      })
    }
  }

  return (
    <>
      <Head>
        <title>Admin – Tjenester | Frilansportalen</title>
        <meta name="description" content="Opprett nye tjenesteprofiler" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Legg ut ny tjeneste</h1>

        <div className="bg-white p-6 rounded-xl shadow max-w-xl">
          {['navn', 'sted', 'kategori', 'tilgjengelighet'].map((felt) => (
            <input
              key={felt}
              type="text"
              placeholder={felt[0].toUpperCase() + felt.slice(1)}
              value={(tjeneste as any)[felt]}
              onChange={(e) =>
                setTjeneste({ ...tjeneste, [felt]: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
          ))}

          <textarea
            placeholder="Beskrivelse"
            value={tjeneste.beskrivelse}
            onChange={(e) =>
              setTjeneste({ ...tjeneste, beskrivelse: e.target.value })
            }
            className="w-full p-2 border rounded mb-4 h-32"
          />

          <button
            onClick={opprettTjeneste}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Publiser tjeneste
          </button>

          {status === 'lagret' && (
            <p className="text-green-600 mt-2">Tjeneste registrert!</p>
          )}
          {status === 'feil' && (
            <p className="text-red-600 mt-2">Noe gikk galt.</p>
          )}
        </div>
      </main>
    </>
  )
}
