// pages/admin/stillinger.tsx
import Head from 'next/head'
import { useState } from 'react'
import supabase from '../../lib/supabaseClient'

export default function AdminStillinger() {
  const [stilling, setStilling] = useState({
    tittel: '',
    sted: '',
    type: '',
    frist: '',
    bransje: '',
    beskrivelse: '',
  })
  const [status, setStatus] = useState<'klar' | 'lagrer' | 'lagret' | 'feil'>('klar')

  const publiser = async () => {
    setStatus('lagrer')
    const { error } = await supabase.from('stillinger').insert([stilling])

    if (error) {
      setStatus('feil')
    } else {
      // Send stilling til match og varsling
      await fetch('/api/stillingsmatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stilling }),
      })

      setStilling({
        tittel: '',
        sted: '',
        type: '',
        frist: '',
        bransje: '',
        beskrivelse: '',
      })
      setStatus('lagret')
    }
  }

  return (
    <>
      <Head>
        <title>Admin – Stillinger | Frilansportalen</title>
        <meta name="description" content="Opprett nye stillingsannonser" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Opprett stilling</h1>

        <div className="bg-white p-6 rounded-xl shadow max-w-xl">
          {['tittel', 'sted', 'type', 'frist', 'bransje'].map((felt) => (
            <input
              key={felt}
              type="text"
              placeholder={felt[0].toUpperCase() + felt.slice(1)}
              value={(stilling as any)[felt]}
              onChange={(e) =>
                setStilling({ ...stilling, [felt]: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
          ))}

          <textarea
            placeholder="Beskrivelse"
            value={stilling.beskrivelse}
            onChange={(e) =>
              setStilling({ ...stilling, beskrivelse: e.target.value })
            }
            className="w-full p-2 border rounded mb-4 h-32"
          />

          <button
            onClick={publiser}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Publiser
          </button>

          {status === 'lagret' && (
            <p className="text-green-600 mt-2">Stilling publisert og varsler sendt!</p>
          )}
          {status === 'feil' && (
            <p className="text-red-600 mt-2">Noe gikk galt.</p>
          )}
        </div>
      </main>
    </>
  )
}
