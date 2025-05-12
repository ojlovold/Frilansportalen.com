// pages/favoritter-tjenester.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'
import { hentFavoritter } from '../lib/favoritt'

type Tjeneste = {
  id: string
  navn: string
  sted: string
  kategori: string
  tilgjengelighet: string
  beskrivelse: string
}

export default function FavorittTjenester() {
  const user = useUser()
  const [tjenester, setTjenester] = useState<Tjeneste[]>([])

  useEffect(() => {
    const hent = async () => {
      if (!user || !user.id) return
      const favorittPoster = await hentFavoritter(user.id, 'tjeneste')
      const idListe = favorittPoster.map((f: any) => f.objekt_id)

      if (idListe.length > 0) {
        const { data, error } = await supabase
          .from('tjenester')
          .select('*')
          .in('id', idListe)

        if (!error && data) setTjenester(data)
      }
    }

    hent()
  }, [user])

  return (
    <>
      <Head>
        <title>Mine lagrede tjenester | Frilansportalen</title>
        <meta name="description" content="Se dine lagrede tjenesteoppføringer" />
      </Head>
      <main className="bg-portalGul min-h-screen text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Mine lagrede tjenester</h1>

        <div className="grid gap-6">
          {tjenester.length === 0 && <p>Du har ikke lagret noen tjenester.</p>}
          {tjenester.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold">{t.navn}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {t.sted} | {t.kategori} | {t.tilgjengelighet}
              </p>
              <p>{t.beskrivelse}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
