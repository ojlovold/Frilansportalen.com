// pages/attester.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'

type Attest = {
  id: string
  navn: string
  fil_url: string
  utlopsdato: string
  varslet: boolean
}

export default function Attester() {
  const user = useUser()
  const [navn, setNavn] = useState('')
  const [dato, setDato] = useState('')
  const [fil, setFil] = useState<File | null>(null)
  const [status, setStatus] = useState<'klar' | 'lagrer' | 'feil' | 'lagret'>('klar')
  const [liste, setListe] = useState<Attest[]>([])

  useEffect(() => {
    const hent = async () => {
      if (!user || !user.id) return
      const { data, error } = await supabase
        .from('attester')
        .select('*')
        .eq('bruker_id', user.id)
        .order('utlopsdato', { ascending: true })
      if (!error && data) setListe(data)
    }
    hent()
  }, [user, status])

  const lastOpp = async () => {
    if (!user || !fil || !navn || !dato) return setStatus('feil')
    setStatus('lagrer')

    const sti = `attester/${user.id}/${Date.now()}-${fil.name}`
    const { error: uploadError } = await supabase.storage
      .from('dokumenter')
      .upload(sti, fil, { upsert: true })

    if (uploadError) return setStatus('feil')

    const { data: urlData } = supabase.storage.from('dokumenter').getPublicUrl(sti)

    const { error: dbError } = await supabase.from('attester').insert([
      {
        bruker_id: user.id,
        navn,
        fil_url: urlData.publicUrl,
        utlopsdato: dato,
      },
    ])

    if (dbError) setStatus('feil')
    else {
      setNavn('')
      setDato('')
      setFil(null)
      setStatus('lagret')
    }
  }

  return (
    <>
      <Head>
        <title>Attester | Frilansportalen</title>
        <meta name="description" content="Last opp og se dine sertifikater og attester" />
      </Head>
      <main className="min-h-screen bg-portalGul p-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Attester og sertifikater</h1>

        <div className="bg-white p-6 rounded-xl shadow max-w-xl mb-10">
          <h2 className="text-xl font-semibold mb-4">Last opp ny attest</h2>

          <input
            type="text"
            placeholder="Navn på attest"
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <input
            type="date"
            value={dato}
            onChange={(e) => setDato(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFil(e.target.files?.[0] || null)}
            className="mb-4"
          />

          <button onClick={lastOpp} className="bg-black text-white px-4 py-2 rounded">
            Last opp
          </button>

          {status === 'lagret' && <p className="text-green-600 mt-2">Attest lagret!</p>}
          {status === 'feil' && <p className="text-red-600 mt-2">Noe gikk galt.</p>}
        </div>

        <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Mine attester</h2>
          {liste.length === 0 && <p>Ingen attester funnet.</p>}
          <ul className="space-y-4">
            {liste.map((a) => (
              <li key={a.id} className="border-b pb-3">
                <p className="font-semibold">{a.navn}</p>
                <p className="text-sm text-gray-600">
                  Utløper: {new Date(a.utlopsdato).toLocaleDateString('no-NO')}
                </p>
                <a href={a.fil_url} target="_blank" className="text-blue-600 underline">
                  Last ned
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}
