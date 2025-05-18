// pages/admin/prosjekter.tsx
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Deltaker = {
  bruker_id: string
  rolle: string
}

export default function AdminProsjekter() {
  const [navn, setNavn] = useState('')
  const [beskrivelse, setBeskrivelse] = useState('')
  const [deltakere, setDeltakere] = useState<Deltaker[]>([])
  const [brukerId, setBrukerId] = useState('')
  const [rolle, setRolle] = useState('')
  const [eksisterende, setEksisterende] = useState<any[]>([])
  const [status, setStatus] = useState<'klar' | 'lagret' | 'feil'>('klar')

  const leggTilDeltaker = () => {
    if (brukerId && rolle) {
      setDeltakere([...deltakere, { bruker_id: brukerId, rolle }])
      setBrukerId('')
      setRolle('')
    }
  }

  const opprettProsjekt = async () => {
    const { data: ny, error } = await supabase
      .from('prosjekter')
      .insert([{ navn, beskrivelse }])
      .select()
      .single()

    if (error || !ny) return setStatus('feil')

    for (const d of deltakere) {
      await supabase.from('prosjektdeltakere').insert([
        {
          prosjekt_id: ny.id,
          bruker_id: d.bruker_id,
          rolle: d.rolle,
        },
      ])
    }

    setNavn('')
    setBeskrivelse('')
    setDeltakere([])
    setStatus('lagret')
  }

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from('prosjekter')
        .select('id, navn, beskrivelse, prosjektdeltakere ( bruker_id, rolle )')
      if (data) setEksisterende(data)
    }
    hent()
  }, [status])

  return (
    <>
      <Head>
        <title>Admin – Prosjekter | Frilansportalen</title>
        <meta name="description" content="Opprett og administrer prosjekter" />
      </Head>
      <main className="min-h-screen bg-portalGul p-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Administrer prosjekter</h1>

        {/* Opprett nytt prosjekt */}
        <div className="bg-white p-6 rounded-xl shadow max-w-xl mb-10">
          <h2 className="text-xl font-semibold mb-4">Nytt prosjekt</h2>

          <input
            type="text"
            placeholder="Prosjektnavn"
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <textarea
            placeholder="Beskrivelse"
            value={beskrivelse}
            onChange={(e) => setBeskrivelse(e.target.value)}
            className="w-full p-2 border rounded mb-4 h-28"
          />

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Legg til deltakere</h3>
            <input
              type="text"
              placeholder="Bruker-ID"
              value={brukerId}
              onChange={(e) => setBrukerId(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Rolle"
              value={rolle}
              onChange={(e) => setRolle(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={leggTilDeltaker}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Legg til
            </button>
          </div>

          <ul className="text-sm mb-4">
            {deltakere.map((d, i) => (
              <li key={i}>
                {d.bruker_id} – {d.rolle}
              </li>
            ))}
          </ul>

          <button
            onClick={opprettProsjekt}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Opprett prosjekt
          </button>

          {status === 'lagret' && <p className="text-green-600 mt-2">Prosjekt opprettet!</p>}
          {status === 'feil' && <p className="text-red-600 mt-2">Noe gikk galt.</p>}
        </div>

        {/* Eksisterende prosjekter */}
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Eksisterende prosjekter</h2>
          {eksisterende.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-semibold">{p.navn}</h3>
              <p className="text-sm text-gray-600 mb-2">{p.beskrivelse}</p>
              <ul className="text-sm">
                {p.prosjektdeltakere.map((d: any, i: number) => (
                  <li key={i}>
                    {d.bruker_id} – {d.rolle}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
