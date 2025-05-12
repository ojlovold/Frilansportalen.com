// pages/favoritter-gjenbruk.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'
import { hentFavoritter } from '../lib/favoritt'

type Gjenbruk = {
  id: string
  tittel: string
  sted: string
  kategori: string
  beskrivelse: string
  pris: number
}

export default function FavorittGjenbruk() {
  const user = useUser()
  const [gjenbruk, setGjenbruk] = useState<Gjenbruk[]>([])

  useEffect(() => {
    const hent = async () => {
      if (!user || !user.id) return
      const favorittPoster = await hentFavoritter(user.id, 'gjenbruk')
      const idListe = favorittPoster.map((f: any) => f.objekt_id)

      if (idListe.length > 0) {
        const { data, error } = await supabase
          .from('gjenbruk')
          .select('*')
          .in('id', idListe)

        if (!error && data) setGjenbruk(data)
      }
    }

    hent()
  }, [user])

  return (
    <>
      <Head>
        <title>Mine lagrede gjenbruksoppføringer | Frilansportalen</title>
        <meta name="description" content="Se dine lagrede gratisoppføringer" />
      </Head>
      <main className="bg-portalGul min-h-screen text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Mine lagrede gjenbruksoppføringer</h1>

        <div className="grid gap-6">
          {gjenbruk.length === 0 && <p>Du har ikke lagret noen oppføringer.</p>}
          {gjenbruk.map((g) => (
            <div key={g.id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold">{g.tittel}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {g.kategori} | {g.sted} | {g.pris === 0 ? 'Gratis' : `${g.pris} kr`}
              </p>
              <p>{g.beskrivelse}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
