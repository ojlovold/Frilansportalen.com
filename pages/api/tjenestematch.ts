// pages/api/tjenestematch.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tjeneste } = req.body

  if (!tjeneste) return res.status(400).json({ error: 'Mangler tjenestedata' })

  const { data: brukere } = await supabase
    .from('brukerprofiler')
    .select('id, rolle, synlighet, sted, bransje')

  const kandidater = (brukere || []).filter((b) =>
    b.rolle === 'jobbsøker' &&
    (b.synlighet === 'alle' || b.synlighet === 'privat') &&
    (!b.sted || b.sted === tjeneste.sted) &&
    (!b.bransje || b.bransje === tjeneste.kategori)
  )

  for (const kandidat of kandidater) {
    await supabase.from('varsler').insert([
      {
        user_id: kandidat.id,
        message: `Ny tjeneste publisert: ${tjeneste.navn}`,
        type: 'info',
      },
    ])
  }

  res.status(200).json({ varslet: kandidater.length })
}
