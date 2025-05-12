// components/Dokumenter.tsx
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../lib/supabaseClient'

type Dokument = {
  bucket: string
  navn: string
  url: string
}

const buckets = ['kvitteringer', 'rapporter', 'signerte-dokumenter']

export default function Dokumenter() {
  const user = useUser()
  const [dokumenter, setDokumenter] = useState<Dokument[]>([])

  useEffect(() => {
    const hentDokumenter = async () => {
      if (!user?.id) return

      const samlet: Dokument[] = []

      for (const bucket of buckets) {
        const { data: filer } = await supabase.storage.from(bucket).list(`${user.id}`)

        for (const fil of filer || []) {
          const sti = `${user.id}/${fil.name}`
          const { data: link } = supabase.storage.from(bucket).getPublicUrl(sti)

          if (link?.publicUrl) {
            samlet.push({
              bucket,
              navn: fil.name,
              url: link.publicUrl,
            })
          }
        }
      }

      setDokumenter(samlet)
    }

    hentDokumenter()
  }, [user])

  if (!user?.id) return null

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Mine dokumenter</h2>

      {dokumenter.length === 0 ? (
        <p>Du har ingen dokumenter lagret ennå.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {dokumenter.map((d, i) => (
            <li key={i} className="flex justify-between items-center border-b pb-1">
              <span className="text-gray-700">{d.navn} <em className="text-xs text-gray-400">({d.bucket})</em></span>
              <a
                href={d.url}
                target="_blank"
                className="text-blue-600 underline"
                rel="noopener noreferrer"
              >
                Last ned
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
