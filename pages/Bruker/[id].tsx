// pages/bruker/[id].tsx
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import supabase from '../../lib/supabaseClient'

type Props = {
  profil: {
    id: string
    navn: string
    rolle: string
    sted?: string
    pris?: number
    beskrivelse?: string
  } | null
  tilgang: boolean
  bildeUrl: string | null
}

export default function BrukerProfil({ profil, tilgang, bildeUrl }: Props) {
  const [forespurt, setForespurt] = useState(false)

  if (!profil || (!tilgang && forespurt)) {
    return (
      <main className="min-h-screen bg-portalGul p-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Profil utilgjengelig</h1>
        <p>Brukeren har skjult profilen sin, eller du har ikke tilgang.</p>
      </main>
    )
  }

  const sendForespørsel = async () => {
    const fraId = document.cookie
      .split('; ')
      .find((row) => row.startsWith('sb-user-id='))
      ?.split('=')[1]

    if (!fraId || !profil?.id) return

    await supabase.from('profiltilgang').insert([
      {
        fra: fraId,
        til: profil.id,
        status: 'venter',
      },
    ])
    setForespurt(true)
  }

  return (
    <>
      <Head>
        <title>{profil.navn} | Frilansportalen</title>
        <meta name="description" content={`Profil for ${profil.navn}`} />
      </Head>
      <main className="bg-portalGul min-h-screen text-black p-8">
        <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto text-center">
          {bildeUrl && (
            <img
              src={bildeUrl}
              alt="Profilbilde"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border"
            />
          )}
          <h1 className="text-3xl font-bold">{profil.navn}</h1>
          <p className="text-sm text-gray-600 mb-2">
            {profil.rolle} | {profil.sted || 'Ukjent'} |{' '}
            {profil.pris ? `${profil.pris} kr/time` : 'Pris ikke oppgitt'}
          </p>
          {profil.beskrivelse && <p className="mt-4">{profil.beskrivelse}</p>}

          {!tilgang && !forespurt && (
            <div className="text-center mt-6">
              <button
                onClick={sendForespørsel}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Be om tilgang til profilen
              </button>
            </div>
          )}

          {forespurt && (
            <p className="text-center mt-6 text-green-600">
              Forespørsel sendt – du får beskjed hvis den godkjennes.
            </p>
          )}
        </div>
      </main>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string
  const currentUserId = ctx.req.cookies['sb-user-id'] || null

  const { data: profil } = await supabase
    .from('brukerprofiler')
    .select('*')
    .eq('id', id)
    .single()

  let tilgang = false
  let bildeUrl: string | null = null

  if (!profil) return { props: { profil: null, tilgang: false, bildeUrl: null } }

  if (profil.rolle === 'frilanser' || profil.synlighet === 'alle') {
    tilgang = true
  } else if (currentUserId) {
    const { data: tilgangsdata } = await supabase
      .from('profiltilgang')
      .select('status')
      .eq('fra', currentUserId)
      .eq('til', id)
      .eq('status', 'godkjent')
      .maybeSingle()

    if (tilgangsdata) tilgang = true
  }

  // Prøv å hente bilde
  const { data: bildeinfo } = supabase.storage
    .from('profilbilder')
    .getPublicUrl(`${id}.jpg`)
  if (bildeinfo?.publicUrl) bildeUrl = bildeinfo.publicUrl

  return {
    props: {
      profil,
      tilgang,
      bildeUrl,
    },
  }
}
