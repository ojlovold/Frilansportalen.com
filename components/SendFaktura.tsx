// components/SendFaktura.tsx
import { useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { sendFaktura } from '../lib/faktura'

export default function SendFaktura() {
  const user = useUser()
  const [mottaker, setMottaker] = useState('')
  const [belop, setBelop] = useState('')
  const [beskrivelse, setBeskrivelse] = useState('')
  const [status, setStatus] = useState<'klar' | 'sendt' | 'feil'>('klar')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !('id' in user)) return setStatus('feil')

    try {
      await sendFaktura({
        frilanser_id: user.id,
        mottaker,
        belop: parseFloat(belop),
        beskrivelse,
        opprettet: new Date().toISOString(),
        status: 'ubetalt',
      })
      setStatus('sendt')
      setMottaker('')
      setBelop('')
      setBeskrivelse('')
    } catch (err) {
      setStatus('feil')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold">Send ny faktura</h2>

      <input
        type="text"
        placeholder="Mottaker"
        value={mottaker}
        onChange={(e) => setMottaker(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Beløp i kr"
        value={belop}
        onChange={(e) => setBelop(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Beskrivelse"
        value={beskrivelse}
        onChange={(e) => setBeskrivelse(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Send faktura
      </button>

      {status === 'sendt' && <p className="text-green-600">Faktura sendt!</p>}
      {status === 'feil' && <p className="text-red-600">Noe gikk galt.</p>}
    </form>
  )
}
