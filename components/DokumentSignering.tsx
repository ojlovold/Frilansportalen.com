// components/DokumentSignering.tsx
import { useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { generateSimplePDF } from '../lib/pdf'
import supabase from '../lib/supabaseClient'

type Props = {
  dokumentId: string
  tittel: string
  tekst: string
}

export default function DokumentSignering({ dokumentId, tittel, tekst }: Props) {
  const user = useUser()
  const [signatur, setSignatur] = useState('')
  const [lagret, setLagret] = useState(false)

  const signerOgLagre = async () => {
    if (!user?.id || !signatur) return

    const kombinert = `${tekst}\n\nSignert av: ${user.id}\nSignatur: ${signatur}`

    const pdf = await generateSimplePDF(tittel, kombinert, user.id, true)
    const blob = new Blob([pdf], { type: 'application/pdf' })

    const filsti = `${user.id}/${dokumentId}.pdf`

    await supabase.storage.from('signerte-dokumenter').upload(filsti, blob, {
      upsert: true,
      contentType: 'application/pdf',
    })

    await supabase.from('signaturer').insert([
      {
        bruker_id: user.id,
        dokument_id: dokumentId,
        signatur,
      },
    ])

    setLagret(true)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">{tittel}</h2>
      <pre className="text-sm whitespace-pre-wrap mb-4">{tekst}</pre>

      <input
        type="text"
        placeholder="Skriv navnet ditt som signatur"
        value={signatur}
        onChange={(e) => setSignatur(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={signerOgLagre}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Signer og lagre
      </button>

      {lagret && <p className="text-green-600 mt-2">Dokument signert og lagret!</p>}
    </div>
  )
}
