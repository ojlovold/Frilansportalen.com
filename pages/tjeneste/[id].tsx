// pages/tjeneste/[id].tsx
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../../lib/supabaseClient'
import { loggVisning } from '../../lib/visningslogg'

type Props = {
  tjeneste: {
    id: string
    navn: string
    sted: string
    kategori: string
    tilgjengelighet: string
    beskrivelse: string
  } | null
}

export default function TjenesteVisning({ tjeneste }: Props) {
  const user = useUser()

  useEffect(() => {
    if (user?.id && tjeneste?.id) {
      loggVisning(user.id, tjeneste.id, 'tjeneste')
    }
  }, [user, tjeneste])

  if (!tjeneste) {
    return (
      <main className="p-8 bg-portalGul min-h-screen text-black">
        <h1 className="text-3xl font-bold">Tjeneste ikke funnet</h1>
        <p>Oppføringen finnes ikke eller er fjernet.</p>
      </main>
    )
  }

  return (
    <>
      <Head>
        <title>{tjeneste.navn} | Frilansportalen</title>
        <meta name="description" content={`Tjeneste: ${tjeneste.navn}`} />
      </Head>
      <main className="p-8 bg-portalGul min-h-screen text-black">
        <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{tjeneste.navn}</h1>
          <p className="text-sm text-gray-600 mb-4">
            {tjeneste.kategori} | {tjeneste.sted} | {tjeneste.tilgjengelighet}
          </p>
          <p>{tjeneste.beskrivelse}</p>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id
  const { data, error } = await supabase
    .from('tjenester')
    .select('*')
    .eq('id', id)
    .single()

  return {
    props: {
      tjeneste: error ? null : data,
    },
  }
}
