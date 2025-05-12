// pages/meldinger.tsx
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'
import SuggestionBox from '../components/SuggestionBox'
import ErrorBox from '../components/ErrorBox'
import ReportBox from '../components/ReportBox'

type Melding = {
  id: string
  avsender: string
  innhold: string
  opprettet: string
}

export default function Meldinger() {
  const user = useUser()
  const [meldinger, setMeldinger] = useState<Melding[]>([])
  const [nyMelding, setNyMelding] = useState('')
  const [sendt, setSendt] = useState(false)

  useEffect(() => {
    const hentMeldinger = async () => {
      if (!user || !user.id) return

      const { data, error } = await supabase
        .from('epost')
        .select('*')
        .eq('til', user.id)
        .order('opprettet', { ascending: false })

      if (!error && data) {
        setMeldinger(data)
      }
    }

    hentMeldinger()
  }, [user])

  const sendMelding = async () => {
    if (!nyMelding || !user || !user.id) return

    const { error } = await supabase.from('epost').insert([
      {
        til: 'system', // evt. admin-id eller en annen bruker
        fra: user.id,
        innhold: nyMelding,
        opprettet: new Date().toISOString(),
      },
    ])

    if (!error) {
      setNyMelding('')
      setSendt(true)
    }
  }

  return (
    <>
      <Head>
        <title>Meldinger | Frilansportalen</title>
        <meta name="description" content="Send og motta meldinger direkte i Frilansportalen" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Meldingssentral</h1>

        {/* Forbedringsforslag og feilmeldingssystem */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SuggestionBox suggestion="Svar raskt og vennlig – AI foreslår: 'Hei! Jeg er interessert i oppdraget ditt.'" />
          <ErrorBox />
          <ReportBox />
        </div>

        {/* Send ny melding */}
        <div className="bg-white p-4 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-2">Ny melding</h2>
          <textarea
            value={nyMelding}
            onChange={(e) => setNyMelding(e.target.value)}
            placeholder="Skriv meldingen din her..."
            className="w-full p-2 border rounded h-28"
          />
          <button
            onClick={sendMelding}
            className="mt-2 bg-black text-white px-4 py-2 rounded"
          >
            Send
          </button>
          {sendt && <p className="text-green-600 mt-2">Melding sendt!</p>}
        </div>

        {/* Innkommende meldinger */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Innboks</h2>
          {meldinger.length === 0 ? (
            <p>Ingen meldinger.</p>
          ) : (
            <ul className="space-y-4">
              {meldinger.map((m) => (
                <li key={m.id} className="border-b pb-2">
                  <p className="text-sm text-gray-600">
                    Fra: {m.avsender} – {new Date(m.opprettet).toLocaleString('no-NO')}
                  </p>
                  <p>{m.innhold}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  )
}
