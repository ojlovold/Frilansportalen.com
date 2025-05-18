// pages/api/tjenesteagent.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tjeneste } = req.body
  if (!tjeneste) return res.status(400).json({ error: 'Mangler tjeneste' })

  const { data: overvakinger } = await supabase.from('tjenesteovervaking').select('*')

  const match = (o: any) =>
    (!o.sted || o.sted === tjeneste.sted) &&
    (!o.kategori || o.kategori === tjeneste.kategori)

  const treff = (overvakinger || []).filter(match)

  for (const o of treff) {
    await supabase.from('varsler').insert([
      {
        user_id: o.bruker_id,
        message: `Ny tjeneste lagt ut: ${tjeneste.navn}`,
        type: 'info',
      },
    ])
  }

  res.status(200).json({ varslet: treff.length })
}
