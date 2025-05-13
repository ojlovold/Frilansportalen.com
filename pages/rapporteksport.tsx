// pages/rapporteksport.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import type { User } from '@supabase/supabase-js'
import supabase from '../lib/supabaseClient'

export default function RapportEksport() {
  const rawUser = useUser()
  const user = rawUser && typeof rawUser === 'object' && rawUser !== null && 'id' in rawUser ? (rawUser as User) : null

  const [fakturaer, setFakturaer] = useState<any[]>([])
  const [kjorebok, setKjorebok] = useState<any[]>([])
  const [rapporter, setRapporter] = useState<any[]>([])
  const [kvitteringer, setKvitteringer] = useState<any[]>([])

  useEffect(() => {
    const hentData = async () => {
      if (!user?.id) return

      const f = await supabase.from('fakturaer').select('*').eq('frilanser_id', user.id)
      if (f.data) setFakturaer(f.data)

      const k = await supabase.from('kjorebok').select('*').eq('bruker_id', user.id)
      if (k.data) setKjorebok(k.data)

      const r = await supabase.from('rapporter').select('*').eq('bruker_id', user.id)
      if (r.data) setRapporter(r.data)

      const kv = await supabase.storage.from('kvitteringer').list(`${user.id}`)
      if (kv.data) {
        const filer = kv.data.map((f) => {
          const { data: urlData } = supabase.storage
            .from('kvitteringer')
            .getPublicUrl(`${user.id}/${f.name}`)
          return { navn: f.name, url: urlData?.publicUrl }
        })
        setKvitteringer(filer)
      }
    }

    hentData()
  }, [user])

  return (
    <>
      <Head>
        <title>Eksport og rapporter | Frilansportalen</title>
        <meta name="description" content="Se og last ned dine økonomiske dokumenter" />
      </Head>
      <main className="bg-portalGul min-h-screen text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Mine rapporter og dokumenter</h1>

        {user?.id && (
          <a
            href={`/api/lastnedAlt?user=${user.id}`}
            className="bg-black text-white px-4 py-2 rounded mb-6 inline-block"
          >
            Last ned alt som ZIP
          </a>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">Fakturaer</h2>
            {fakturaer.map((f) => (
              <div key={f.id} className="text-sm mb-2">
                {f.beskrivelse} – {f.belop} kr – {new Date(f.opprettet).toLocaleDateString('no-NO')}
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">Kjørebok</h2>
            {kjorebok.map((t) => (
              <div key={t.id} className="text-sm mb-2">
                {t.dato}: {t.fra} → {t.til} ({t.kilometer} km)
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">PDF-rapporter</h2>
            {rapporter.map((r) => (
              <div key={r.id} className="mb-2">
                <a href={r.fil_url} target="_blank" className="text-blue-600 underline">
                  {r.navn}
                </a>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3">Kvitteringer</h2>
            {kvitteringer.map((k) => (
              <div key={k.navn} className="mb-2">
                <a href={k.url} target="_blank" className="text-blue-600 underline">
                  {k.navn}
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
