// pages/kjorebok.tsx
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'

type Tur = {
  id: string
  dato: string
  fra: string
  til: string
  kilometer: number
  transportmiddel: string
  bompenger: number
  ferge: number
  drivstoff: number
  formål: string
  prosjektnr?: string
  referanse?: string
}

export default function Kjorebok() {
  const user = useUser()
  const [tur, setTur] = useState<Omit<Tur, 'id'>>({
    dato: '',
    fra: '',
    til: '',
    kilometer: 0,
    transportmiddel: '',
    bompenger: 0,
    ferge: 0,
    drivstoff: 0,
    formål: '',
    prosjektnr: '',
    referanse: '',
  })
  const [status, setStatus] = useState<'klar' | 'lagret' | 'feil'>('klar')
  const [logg, setLogg] = useState<Tur[]>([])

  useEffect(() => {
    const hentTurer = async () => {
      if (!user || !user.id) return
      const { data, error } = await supabase
        .from('kjorebok')
        .select('*')
        .eq('bruker_id', user.id)
        .order('dato', { ascending: false })

      if (!error && data) setLogg(data)
    }

    hentTurer()
  }, [user, status])

  const lagreTur = async () => {
    if (!user || !user.id) return setStatus('feil')
    const { error } = await supabase.from('kjorebok').insert([
      {
        ...tur,
        bruker_id: user.id,
      },
    ])
    if (error) setStatus('feil')
    else {
      setTur({
        dato: '',
        fra: '',
        til: '',
        kilometer: 0,
        transportmiddel: '',
        bompenger: 0,
        ferge: 0,
        drivstoff: 0,
        formål: '',
        prosjektnr: '',
        referanse: '',
      })
      setStatus('lagret')
    }
  }

  return (
    <>
      <Head>
        <title>Kjørebok | Frilansportalen</title>
        <meta name="description" content="Registrer kjøreturer og reiseregning" />
      </Head>
      <main className="min-h-screen bg-portalGul p-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Kjørebok</h1>

        {/* Ny tur */}
        <div className="bg-white p-6 rounded-xl shadow max-w-3xl mb-10">
          <h2 className="text-xl font-semibold mb-4">Ny tur</h2>
          {[
            { label: 'Dato', key: 'dato', type: 'date' },
            { label: 'Fra', key: 'fra' },
            { label: 'Til', key: 'til' },
            { label: 'Kilometer', key: 'kilometer', type: 'number' },
            { label: 'Transportmiddel', key: 'transportmiddel' },
            { label: 'Bompenger', key: 'bompenger', type: 'number' },
            { label: 'Ferge', key: 'ferge', type: 'number' },
            { label: 'Drivstoff', key: 'drivstoff', type: 'number' },
            { label: 'Formål', key: 'formål' },
            { label: 'Prosjektnummer', key: 'prosjektnr' },
            { label: 'Referanse', key: 'referanse' },
          ].map((felt) => (
            <input
              key={felt.key}
              type={felt.type || 'text'}
              placeholder={felt.label}
              value={(tur as any)[felt.key]}
              onChange={(e) =>
                setTur({
                  ...tur,
                  [felt.key]: felt.type === 'number' ? Number(e.target.value) : e.target.value,
                })
              }
              className="w-full p-2 border rounded mb-4"
            />
          ))}

          <button
            onClick={lagreTur}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Lagre tur
          </button>
          {status === 'lagret' && <p className="text-green-600 mt-2">Tur lagret!</p>}
          {status === 'feil' && <p className="text-red-600 mt-2">Noe gikk galt.</p>}
        </div>

        {/* Tidligere turer */}
        <div className="bg-white p-6 rounded-xl shadow max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Logg</h2>
          {logg.length === 0 && <p>Ingen registrerte turer.</p>}
          <ul className="space-y-4">
            {logg.map((t) => (
              <li key={t.id} className="border-b pb-3">
                <p className="font-semibold">
                  {t.dato} – {t.fra} → {t.til} ({t.kilometer} km, {t.transportmiddel})
                </p>
                <p className="text-sm text-gray-600">
                  Bompenger: {t.bompenger} kr | Ferge: {t.ferge} kr | Drivstoff: {t.drivstoff} kr
                </p>
                <p className="text-sm text-gray-600">
                  Prosjektnr: {t.prosjektnr || '-'} | Referanse: {t.referanse || '-'}
                </p>
                <p>{t.formål}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}
