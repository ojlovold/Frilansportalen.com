// pages/signering.tsx
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import DokumentSignering from '../components/DokumentSignering'

export default function Signering() {
  const user = useUser()

  // Her kan du bytte ut listen med dynamisk data fra Supabase senere
  const dokumenter = [
    {
      id: 'oppdragsavtale-001',
      tittel: 'Oppdragsavtale',
      tekst:
        'Denne avtalen gjelder mellom oppdragsgiver og frilanser...\n\nDato: 01.06.2025\nSted: Oslo',
    },
    {
      id: 'hms-egenerklaring-2025',
      tittel: 'HMS Egenerklæring',
      tekst:
        'Jeg bekrefter at jeg følger gjeldende HMS-regler og har forstått ansvaret mitt som selvstendig næringsdrivende.',
    },
  ]

  return (
    <>
      <Head>
        <title>Signering | Frilansportalen</title>
        <meta name="description" content="Signer viktige dokumenter digitalt" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Dokumentsignering</h1>

        {!user?.id ? (
          <p>Du må være innlogget for å signere dokumenter.</p>
        ) : (
          <div className="space-y-10">
            {dokumenter.map((d) => (
              <DokumentSignering
                key={d.id}
                dokumentId={d.id}
                tittel={d.tittel}
                tekst={d.tekst}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
