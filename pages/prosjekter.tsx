// pages/prosjekter.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'

type Prosjekt = {
  id: string
  navn: string
  beskrivelse: string
  rolle: string
}

export default function MineProsjekter() {
  const rawUser = useUser()
  const userId = typeof rawUser === 'object' && rawUser !== null && 'id' in rawUser
    ? String((rawUser as any).id)
    : null

  const [prosjekter, setProsjekter] = useState<Prosjekt[]>([])

  useEffect(() => {
    const hent = async () => {
      if (!userId) return

      const { data: deltakelser, error } = await supabase
        .from('prosjektdeltakere')
        .select('prosjekt_id, rolle, prosjekter ( id, navn, beskrivelse )')
        .eq('bruker_id', userId)

      if (!error && deltakelser) {
        const renset = deltakelser.map((d: any) => ({
          id: d.prosjekter.id,
          navn: d.prosjekter.navn,
          beskrivelse: d.prosjekter.beskrivelse,
          rolle: d.rolle,
        }))
        setProsjekter(renset)
      }
    }

    hent()
  }, [userId])

  return (
    <>
      <Head>
        <title>Mine prosjekter | Frilansportalen</title>
        <meta name="description" content="Prosjekter du er med i" />
      </Head>
      <main className="min-h-screen bg-portalGul p-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Mine prosjekter</h1>

        <div className="grid gap-4 max-w-3xl">
          {prosjekter.length === 0 && <p>Du er ikke med i noen prosjekter ennå.</p>}
          {prosjekter.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-xl font-semibold">{p.navn}</h2>
              <p className="text-sm text-gray-600 mb-1">Rolle: {p.rolle}</p>
              <p>{p.beskrivelse}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
