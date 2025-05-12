// pages/api/gjenbrukmatch.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { oppforing } = req.body
  if (!oppforing) return res.status(400).json({ error: 'Mangler data' })

  const { data: brukere } = await supabase
    .from('brukerprofiler')
    .select('id, sted, synlighet')

  const kandidater = (brukere || []).filter((b) =>
    (b.sted && b.sted === oppforing.sted) &&
    (b.synlighet === 'alle' || b.synlighet === 'privat')
  )

  for (const kandidat of kandidater) {
    await supabase.from('varsler').insert([
      {
        user_id: kandidat.id,
        message: `Ny oppføring i Gjenbruksportalen (${oppforing.kategori})`,
        type: 'info',
      },
    ])
  }

  res.status(200).json({ varslet: kandidater.length })
}
