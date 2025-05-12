// pages/favoritter.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'
import { hentFavoritter } from '../lib/favoritt'

type Stilling = {
  id: string
  tittel: string
  sted: string
  type: string
  frist: string
  bransje: string
  beskrivelse: string
}

export default function Favoritter() {
  const user = useUser()
  const [favoritter, setFavoritter] = useState<Stilling[]>([])

  useEffect(() => {
    const hent = async () => {
      if (!user || !user.id) return
      const favorittPoster = await hentFavoritter(user.id, 'stilling')
      const idListe = favorittPoster.map((f: any) => f.objekt_id)

      if (idListe.length > 0) {
        const { data, error } = await supabase
          .from('stillinger')
          .select('*')
          .in('id', idListe)

        if (!error && data) setFavoritter(data)
      }
    }

    hent()
  }, [user])

  return (
    <>
      <Head>
        <title>Mine favoritter | Frilansportalen</title>
        <meta name="description" content="Se dine lagrede stillingsannonser" />
      </Head>
      <main className="bg-portalGul min-h-screen text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Mine lagrede stillinger</h1>

        <div className="grid gap-6">
          {favoritter.length === 0 && <p>Du har ikke lagret noen stillinger.</p>}
          {favoritter.map((s) => (
            <div key={s.id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold">{s.tittel}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {s.sted} | {s.type} | Frist: {s.frist} | {s.bransje}
              </p>
              <p>{s.beskrivelse}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
