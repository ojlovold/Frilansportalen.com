// pages/api/gjenbruksagent.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { oppforing } = req.body
  if (!oppforing) return res.status(400).json({ error: 'Mangler oppføring' })

  const { data: overvakinger } = await supabase.from('gjenbruksovervaking').select('*')

  const treff = (overvakinger || []).filter((o) =>
    (!o.sted || o.sted === oppforing.sted) &&
    (!o.kategori || o.kategori === oppforing.kategori)
  )

  for (const o of treff) {
    await supabase.from('varsler').insert([
      {
        user_id: o.bruker_id,
        message: `Ny gratisoppføring i ${oppforing.sted}: ${oppforing.tittel}`,
        type: 'info',
      },
    ])
  }

  res.status(200).json({ varslet: treff.length })
}
