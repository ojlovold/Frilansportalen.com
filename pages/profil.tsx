// pages/profil.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'
import { hentUtkast, lagreUtkast, slettUtkast } from '../lib/utkast'

export default function Profil() {
  const rawUser = useUser()
  const userId = typeof rawUser === 'object' && rawUser && 'id' in rawUser ? String(rawUser.id) : null

  const [profil, setProfil] = useState<any>(null)
  const [synlighet, setSynlighet] = useState('alle')
  const [status, setStatus] = useState<'klar' | 'lagrer' | 'lagret' | 'feil'>('klar')

  const mottaker = 'profil'
  const modul = 'profil_redigering'

  useEffect(() => {
    const hent = async () => {
      if (!userId) return

      const { data } = await supabase
        .from('brukerprofiler')
        .select('*')
        .eq('id', userId)
        .single()

      if (data) {
        setProfil(data)
        setSynlighet(data.synlighet || 'alle')
      }

      const utkast = await hentUtkast(userId, mottaker, modul)
      if (utkast) {
        try {
          const parsed = JSON.parse(utkast)
          setProfil((p: any) => ({ ...p, ...parsed }))
        } catch {}
      }
    }

    hent()
  }, [userId])

  useEffect(() => {
    const delay = setTimeout(() => {
      if (userId && profil) {
        lagreUtkast(userId, mottaker, modul, JSON.stringify(profil))
      }
    }, 1000)
    return () => clearTimeout(delay)
  }, [profil, userId])

  const lagre = async () => {
    if (!userId || !profil) return
    setStatus('lagrer')

    const { error } = await supabase
      .from('brukerprofiler')
      .update({ ...profil, synlighet })
      .eq('id', userId)

    if (error) {
      setStatus('feil')
    } else {
      setStatus('lagret')
      slettUtkast(userId, mottaker, modul)
    }
  }

  if (!profil) return null

  return (
    <>
      <Head>
        <title>Min profil | Frilansportalen</title>
        <meta name="description" content="Se og oppdater din brukerprofil" />
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Min profil</h1>

        <div className="bg-white p-6 rounded-xl shadow max-w-xl">
          <label className="block mb-2">Navn</label>
          <input
            type="text"
            value={profil.navn || ''}
            onChange={(e) => setProfil({ ...profil, navn: e.target.value })}
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block mb-2">E-post</label>
          <input
            type="email"
            value={profil.epost || ''}
            onChange={(e) => setProfil({ ...profil, epost: e.target.value })}
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block mb-2">Telefon</label>
          <input
            type="tel"
            value={profil.telefon || ''}
            onChange={(e) => setProfil({ ...profil, telefon: e.target.value })}
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block mb-2">Synlighet</label>
          <select
            value={synlighet}
            onChange={(e) => setSynlighet(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="alle">Synlig for alle</option>
            <option value="arbeidsgivere">Kun arbeidsgivere</option>
            <option value="frilansere">Kun frilansere</option>
            <option value="privat">Skjult</option>
          </select>

          <button
            onClick={lagre}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Lagre profil
          </button>

          {status === 'lagret' && (
            <p className="text-green-600 mt-2">Profil oppdatert!</p>
          )}
          {status === 'feil' && (
            <p className="text-red-600 mt-2">Noe gikk galt.</p>
          )}
        </div>
      </main>
    </>
  )
}
