import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import type { User } from '@supabase/supabase-js'
import DokumentSignering from '../components/DokumentSignering'

export default function Signering() {
  const rawUser = useUser()
  const user = rawUser && typeof rawUser === 'object' && rawUser !== null && 'id' in rawUser ? (rawUser as User) : null

  return (
    <>
      <Head>
        <title>Signering | Frilansportalen</title>
        <meta name="description" content="Signer PDF-dokumenter og lagre i skyen" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dokumentsignering</h1>

        {!user ? (
          <p>Du må være innlogget for å signere dokumenter.</p>
        ) : (
          <div className="space-y-10">
            <DokumentSignering brukerId={user.id} />
          </div>
        )}
      </main>
    </>
  )
}
