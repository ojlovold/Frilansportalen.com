import { useUser } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import supabase from '../lib/supabaseClient'

type Props = {
  brukerId: string
}

export default function DokumentSignering({ brukerId }: Props) {
  const [fil, setFil] = useState<File | null>(null)
  const [status, setStatus] = useState<'klar' | 'signerer' | 'lagret' | 'feil'>('klar')

  const signer = async () => {
    if (!fil) return
    setStatus('signerer')

    const dokumentId = fil.name.replace('.pdf', '')

    const { error: uploadError } = await supabase.storage
      .from('signerte-dokumenter')
      .upload(`${brukerId}/${dokumentId}.pdf`, fil, {
        upsert: true,
        contentType: 'application/pdf',
      })

    if (uploadError) {
      setStatus('feil')
      return
    }

    const { error: dbError } = await supabase.from('signaturer').insert([
      {
        bruker_id: brukerId,
        dokument_id: dokumentId,
        signatur: 'signert',
        tidspunkt: new Date().toISOString(),
      },
    ])

    if (dbError) {
      setStatus('feil')
    } else {
      setFil(null)
      setStatus('lagret')
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Signer dokument</h2>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="mb-3"
      />
      <button
        onClick={signer}
        className="bg-black text-white px-4 py-2 rounded text-sm"
      >
        Last opp og signer
      </button>
      {status === 'lagret' && <p className="text-green-600 mt-2">Signering lagret!</p>}
      {status === 'feil' && <p className="text-red-600 mt-2">Noe gikk galt.</p>}
    </div>
  )
}
