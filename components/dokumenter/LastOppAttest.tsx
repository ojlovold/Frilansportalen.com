import { useUser } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import supabase from '@/lib/supabaseClient'

export default function LastOppAttest() {
  const user = useUser()
  const [fil, setFil] = useState<File | null>(null)
  const [status, setStatus] = useState("")

  const lastOpp = async () => {
    if (!user?.id || !fil) return

    const path = `attester/${user.id}/${fil.name}`
    const { error } = await supabase.storage
      .from('attester')
      .upload(path, fil, { upsert: true })

    if (error) {
      setStatus('Feil ved opplasting')
      console.error(error.message)
    } else {
      setStatus('Attest lastet opp')
      setFil(null)
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button
        onClick={lastOpp}
        className="bg-black text-white px-4 py-2 rounded"
        disabled={!fil}
      >
        Last opp attest
      </button>
      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
    </div>
  )
}
