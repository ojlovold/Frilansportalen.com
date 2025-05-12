// pages/api/stillingsmatch.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { stilling } = req.body

  if (!stilling) return res.status(400).json({ error: 'Mangler stillingsdata' })

  const { data: brukere } = await supabase
    .from('brukerprofiler')
    .select('id, rolle, synlighet, sted, bransje')

  const kandidater = (brukere || []).filter((b) =>
    b.rolle === 'frilanser' &&
    (b.synlighet === 'alle' || b.synlighet === 'privat') &&
    (!b.sted || b.sted === stilling.sted) &&
    (!b.bransje || b.bransje === stilling.bransje)
  )

  for (const kandidat of kandidater) {
    await supabase.from('varsler').insert([
      {
        user_id: kandidat.id,
        message: `Ny stilling lagt ut: ${stilling.tittel}`,
        type: 'info',
      },
    ])
  }

  res.status(200).json({ antall: kandidater.length })
}
