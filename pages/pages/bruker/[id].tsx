// pages/bruker/[id].tsx
import { GetServerSideProps } from 'next'
import Head from 'next/head'
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
  if (!profil || !tilgang) {
    return (
      <main className="min-h-screen bg-portalGul p-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Profil utilgjengelig</h1>
        <p>Brukeren har skjult profilen sin, eller du har ikke tilgang.</p>
      </main>
    )
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
        </div>
      </main>
    </>
  )
}
