// components/dokumenter/MineAttester.tsx
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../../lib/supabaseClient'

type Dokument = {
  navn: string
  url: string
}

export default function MineAttester() {
  const user = useUser()
  const [attester, setAttester] = useState<Dokument[]>([])

  useEffect(() => {
    const hent = async () => {
      if (!user?.id) return

      const { data: filer } = await supabase.storage.from('attester').list(user.id)
      if (!filer) return

      const filerMedUrl = filer.map((fil) => {
        const sti = `${user.id}/${fil.name}`
        const { data: link } = supabase.storage.from('attester').getPublicUrl(sti)
        return {
          navn: fil.name,
          url: link?.publicUrl || '#',
        }
      })

      setAttester(filerMedUrl)
    }

    hent()
  }, [user])

  if (!user?.id) return null

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-4">
      <h2 className="text-xl font-semibold mb-3">Mine helseattester og dokumenter</h2>

      {attester.length === 0 ? (
        <p>Du har ingen attester lagret ennå.</p>
      ) : (
        <ul className="text-sm space-y-2">
          {attester.map((a, i) => (
            <li key={i} className="flex justify-between items-center border-b pb-1">
              <span>{a.navn}</span>
              <a href={a.url} target="_blank" className="text-blue-600 underline">
                Last ned
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
