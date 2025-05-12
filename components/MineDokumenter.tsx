// components/MineDokumenter.tsx
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'

type Fil = {
  navn: string
  url: string
}

export default function MineDokumenter() {
  const user = useUser()
  const [filer, setFiler] = useState<Fil[]>([])

  useEffect(() => {
    const hentKvitteringer = async () => {
      if (!user || !user.id) return

      const sti = `kvitteringer/${user.id}`
      const { data, error } = await supabase.storage.from('kvitteringer').list(sti)

      if (error || !data) return

      const medUrl: Fil[] = data.map((fil) => {
        const { data: urlData } = supabase.storage
          .from('kvitteringer')
          .getPublicUrl(`${sti}/${fil.name}`)

        return {
          navn: fil.name,
          url: urlData.publicUrl,
        }
      })

      setFiler(medUrl)
    }

    hentKvitteringer()
  }, [user])

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Mine kvitteringer</h2>
      {filer.length === 0 && <p>Ingen kvitteringer funnet.</p>}
      <ul className="space-y-2">
        {filer.map((fil) => (
          <li key={fil.navn}>
            <a
              href={fil.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {fil.navn}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
