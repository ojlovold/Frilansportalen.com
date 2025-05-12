// components/MineRapporter.tsx
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'

type Rapport = {
  navn: string
  url: string
}

export default function MineRapporter() {
  const user = useUser()
  const [rapporter, setRapporter] = useState<Rapport[]>([])

  useEffect(() => {
    const hentRapporter = async () => {
      if (!user || !user.id) return

      const sti = `rapporter/${user.id}`
      const { data, error } = await supabase.storage.from('rapporter').list(sti)

      if (error || !data) return

      const medUrl = data.map((fil) => {
        const { data: urlData } = supabase.storage
          .from('rapporter')
          .getPublicUrl(`${sti}/${fil.name}`)

        return {
          navn: fil.name,
          url: urlData.publicUrl,
        }
      })

      setRapporter(medUrl)
    }

    hentRapporter()
  }, [user])

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Mine rapporter</h2>
      {rapporter.length === 0 && <p>Ingen rapporter funnet.</p>}
      <ul className="space-y-2">
        {rapporter.map((r) => (
          <li key={r.navn}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {r.navn}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
