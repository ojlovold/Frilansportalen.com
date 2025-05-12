// components/dugnad/DugnadSvarListe.tsx
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '@/lib/supabaseClient'

export default function DugnadSvarListe({ dugnadId }: { dugnadId: string }) {
  const user = useUser()
  const [svar, setSvar] = useState<any[]>([])
  const [erEier, setErEier] = useState(false)

  useEffect(() => {
    const hent = async () => {
      const { data: dugnad } = await supabase
        .from('dugnader')
        .select('opprettet_av')
        .eq('id', dugnadId)
        .single()

      const brukerId = user && 'id' in user ? (user.id as string) : null
      if (dugnad?.opprettet_av !== brukerId) {
        setErEier(false)
        return
      }

      setErEier(true)

      const { data: svarData } = await supabase
        .from('dugnad_svar')
        .select('*')
        .eq('dugnad_id', dugnadId)

      setSvar(svarData || [])
    }

    hent()
  }, [dugnadId, user])

  if (!erEier) return null

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Svar fra deltakere</h2>

      {svar.length === 0 ? (
        <p>Ingen har svart på denne dugnaden ennå.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {svar.map((s, i) => (
            <li key={i} className="border-b pb-2">
              <p><strong>{s.navn || 'Ukjent'}</strong> – {s.status}</p>
              {s.kommentar && <p className="text-gray-600 italic">{s.kommentar}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
