// pages/stilling/[id].tsx
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import supabase from '../../lib/supabaseClient'

type Props = {
  stilling: {
    id: string
    tittel: string
    sted: string
    type: string
    frist: string
    bransje: string
    beskrivelse: string
  } | null
}

export default function StillingVisning({ stilling }: Props) {
  if (!stilling) {
    return (
      <main className="p-8 bg-portalGul min-h-screen text-black">
        <h1 className="text-3xl font-bold">Stilling ikke funnet</h1>
        <p>Stillingen finnes ikke eller er slettet.</p>
      </main>
    )
  }

  return (
    <>
      <Head>
        <title>{stilling.tittel} | Frilansportalen</title>
        <meta name="description" content={`Stilling: ${stilling.tittel}`} />
      </Head>
      <main className="p-8 bg-portalGul min-h-screen text-black">
        <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{stilling.tittel}</h1>
          <p className="text-sm text-gray-600 mb-4">
            {stilling.sted} | {stilling.type} | Frist: {stilling.frist} | {stilling.bransje}
          </p>
          <p>{stilling.beskrivelse}</p>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id
  const { data, error } = await supabase.from('stillinger').select('*').eq('id', id).single()

  return {
    props: {
      stilling: error ? null : data,
    },
  }
}
